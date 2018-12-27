const md5 = require('md5');

exports.changeGeneral = (req, res, next) => {
	const { Model } = req.app;
	const { id } = req.session.user;
	const fields = req.body;

	if (!!fields.surname && !!fields.firstname) {
		fields.name = `${fields.surname} ${fields.firstname[0]}.`;
	}

	const queryStr = Object.keys(fields).map(fieldName => `${fieldName} = '${fields[fieldName]}'`).join(', ');

	return Model.clients.upd({ id, queryStr }).then(async ([error, data]) => {
		if (error) return Promise.reject({ status: 'bad', message: error.message, error });
		return Model.clients.get({ id });
	}).then(([, [client]]) => {
		req.session.user.clientName = client.name;
	}).then(() => {
		return { status: 'ok' }
	}).catch(error => {
		return { message: error.message, error }
	})
}

exports.changePersonal = async (req, res, next) => {
	const { Model } = req.app;
	const { id } = req.session.user;
	const fields = req.body;

	const queryStr = Object.keys(fields).map(fieldName => `${fieldName} = '${fields[fieldName]}'`).join(', ');

	await Model.clients.upd({ id, queryStr })
	return { status: 'ok' }
}

exports.changePhone = async (req, res, next) => {
	try {
		const { Model } = req.app;
		const { phone } = req.body;

		var [error, clientsByNewPhone] = await Model.clients.get({ phone });
		if (clientsByNewPhone.length > 0) return { message: 'На данный номер телефона уже зарегистрирован аккаунт на сайте' };

		var [error, [currentCode]] = await Model.confirmedPhones.get({ phone, confirmed: '0' });

		let code = '';

		if (!!currentCode === false) {
			code = req.app.Helpers.getRandomNumber(6);
			var [error, codeId] = await Model.confirmedPhones.add({ phone, code, client_id: req.session.user.id });
		} else {
			code = currentCode.code;
		}

		var [error, [result = { value: '' }]] = await Model.siteConfig.get({ target: 'smsTemplatePhoneConfirm' });
		var smsMessage = result.value.replace(/{{code}}/g, code);

		await app.smsc.send({ phones: phone, mes: smsMessage });

		req.session.tempPhone = phone;

		return { status: 'ok' }
	} catch (error) {
		console.log(error);
		return { message: 'Что-то пошло не так. Попробуйте позже', error };
	}
}

exports.confirmPhone = async (req, res, next) => {
	try {
		if (!!req.session.tempPhone === false) return { message: 'Ошибка.' };

		const { Model } = req.app;
		const { code } = req.body;
		const { id } = req.session.user;
		const phone = req.session.tempPhone;

		var [error, [currentCode]] = await Model.confirmedPhones.get({ phone, confirmed: '0' });
		if (!!currentCode === false) return { message: 'Ошибка. Перезагрузите страницу и попробуйте снова' };

		if (currentCode.code !== code) return { message: 'Неверный код подтверждения' };

		await Model.clients.upd({ id, target: 'phone', value: phone });
		await Model.confirmedPhones.upd({ id: currentCode.id, target: 'confirmed', value: '1' });

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: 'Что-то пошло не так. Попробуйте позже' };
	}
}

exports.changeSecurity = async (req, res, next) => {
	const { Model } = req.app;
	const { id } = req.session.user;
	let [, [curClient]] = await Model.clients.get({ id: req.session.user.id });

	if (!!curClient === false) {
		return { status: 'bad', message: 'Ошибка проверки клиента. Сообщите об ошибке на сайте, и попробуйте позже' };
	}

	if (req.body.newPass.length < 6) {
		return { status: 'bad', message: 'Длина пароля должна быть длиньше 6 символов' };
	}

	let encodeBodyOldPass = md5(req.body.oldPass);
	let encodeBodyNewPass = md5(req.body.newPass);

	if (encodeBodyOldPass !== curClient.password) {
		return { status: 'bad', message: 'Неверно набран старый пароль' };
	}

	if (req.body.newPass !== req.body.checkPass) {
		return { status: 'bad', message: 'Неверный повторный пароль. Проверьте правильность ввода и попробуйте снова.' }
	}

	return Model.clients.upd({ id, target: 'password', value: encodeBodyNewPass }).then(([error, results]) => {
		return { status: 'ok' };
	}).catch(e => {
		return { status: 'bad', message: 'Ошибка при изменении данных. Сообщите об ошибке на сайте, и попробуйте позже.' }
	})
}