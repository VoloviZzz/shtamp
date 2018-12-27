const md5 = require('md5');

exports.index = async (req, res) => {
	try {
		const mailOptions = {};
		const domainName = await app.siteConfig.get('domainName');
		const Model = req.app.Model;
		const data = req.body;
		let user;

		[, [user]] = await Model.clients.get({ email: data.userEmail });

		if (!!user === false) return { status: 'bad', message: 'Пользователя с такой почтой не найдено. Проверьте данные, и попробуйте снова.' };

		let userNewPass = req.app.Helpers.getRandomNumber(6);

		mailOptions.to = data.userEmail;
		mailOptions.html = app.siteConfig.get('emailPasswordReset').replace(/{{password}}/ig, userNewPass);
		mailOptions.subject = app.siteConfig.get('emailPasswordResetSubject').replace(/{{siteName}}/ig, domainName);

		let md5Pass = md5(userNewPass);

		await app.sendEmail(mailOptions);

		await Model.clients.upd({ target: 'password', id: user.id, value: md5Pass });

		return { status: 'ok', message: 'Новый пароль сгенирирован и отправлен на почту' }
	} catch (error) {
		console.log(error);
		return { status: 'bad', message: 'Что-то пошло не так. Сообщите нам о проблеме и мы решим её как можно скорее.' }
	}
}