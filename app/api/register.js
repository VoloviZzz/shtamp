const Model = require('../models');
const md5 = require('md5');

exports.register = async function (req, res, next) {
	try {
		const data = req.body;

		const allowRegisttration = app.siteConfig.get('allowRegistration');
		if (allowRegisttration !== '' && allowRegisttration != '1') return { message: 'На данный момент регистрация на сайте приостановлена. Попробуйте позже.' };

		if (data.password.length < 6) return { status: 'bad', message: 'Длина пароля не может быть менее 6 символов' };
		if (data.password !== data['check-password']) return { status: 'bad', message: 'Пароли не совпадают' };

		let [errPhone, checkPhone] = await Model.clients.get({ phone: data.phone });
		if (errPhone) return { status: 'bad', message: errPhone.message, error: errPhone };
		if (checkPhone.length > 0) return { status: 'bad', message: 'На данный номер уже есть зарегистрированный пользователь.' }

		let [errMail, checkMail] = await Model.clients.get({ email: data.email })
		if (errMail) return { status: 'bad', message: errMail.message, error: errMail };
		if (checkMail.length > 0) return { status: 'bad', message: 'На данный адрес электронной почты уже есть зарегистрированный пользователь' }

		data.name = `${data.surname} ${data.firstname[0]}.`;

		var [errAdd, addClient] = await Model.clients.create(data);
		if (errAdd) return { status: 'bad', message: errAdd.message, error: errAdd };


		var [error, client] = await Model.clients.get({ id: addClient });
		if (error) return { message: 'Что-то пошло не так' };
		if (client.length < 1) return { status: 'bad', message: 'Ошибка в получении клиента', error };

		var client = client[0] || false;
		var [error, uncofirmed] = await Model.confirmedPhones.get({ phone: client.phone, confirmed: '0' });

		if (error) return { message: 'Что-то пошло не так' };

		let code = null;
		let codeId = null;

		if (uncofirmed.length > 0) {
			code = uncofirmed[0].code;
			codeId = uncofirmed[0].id;
		} else {
			code = req.app.Helpers.getRandomNumber(6);

			var [error, result] = await Model.confirmedPhones.add({ phone: client.phone, code, client_id: client.id })
			if (error) return Promise.reject(error);

			codeId = result;
		}

		req.session.registerData = { codeId, code, clientId: client.id };

		var [error, [result = { value: '' }]] = await Model.siteConfig.get({ target: 'smsTemplatePhoneConfirm' });
		var smsMessage = result.value.replace(/{{code}}/g, code);

		await app.smsc.send({ phones: req.body.phone, mes: smsMessage });
		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: 'Что-то пошло не так', error };
	}
}

exports.confirmRegister = (req, res, next) => {

	let { code } = req.body;

	if (code != req.session.registerData.code) {
		return { message: 'Код неверный' };
	}

	return Model.confirmedPhones.upd({ target: 'confirmed', value: '1', id: req.session.registerData.codeId }).then(async ([error]) => {
		if (error) {
			console.log(error);
			return { message: 'Ошибка' }
		}

		return Model.clients.upd({ target: 'confirmed', value: '1', id: req.session.registerData.clientId });
	}).then(() => {
		delete req.session.registerData;

		return { status: 'ok' };
	});
}


exports.sendConfirmAgain = async (req, res) => {
	try {
		const mailOptions = {};
		const data = req.body;

		if (!data.userEmail) return { status: 'bad', message: 'Ошибка! Почта не должна оставаться пустой!!!' };

		var [error, [user] = [false]] = await Model.clients.get({ email: data.userEmail })

		if (!!user === false) {
			return { status: 'bad', message: 'Пользователя с такой почтой не найдено. Проверьте данные, и попробуйте снова.' }
		}

		const unicHash = md5(user.id);
		const unicHref = `${app.siteConfig.get('siteUrlWithProtocolAndHost')}/confirm-email/?t=${unicHash}`;

		const link = `<a href="${unicHref}">${unicHref}</a>`;
		const domainName = app.siteConfig.get('domainName');

		mailOptions.to = data.userEmail;
		mailOptions.html = app.siteConfig.get('emailRegisterConfirm').replace(/{{link}}/ig, link);
		mailOptions.subject = app.siteConfig.get('emailRegisterConfirmSubject').replace(/{{siteName}}/ig, domainName);

		await app.sendEmail(mailOptions)
		await Model.confirmEmails.add({ client_id: user.id, hash: unicHash });

		return { status: 'ok', message: 'Письмо отправлено на почту' }
	} catch (error) {
		console.log(error);
		return { status: 'bad', message: 'Что-то пошло не так. Сообщите нам о проблеме и мы решим её как можно скорее.', error }
	}
}