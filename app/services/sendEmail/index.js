const nodemailer = require('nodemailer');

const secure = false;
const tls = {
	rejectUnauthorized: false
};

const init = async (app) => {

	app.transporter = false;

	const host = app.siteConfig.get('emailHost');
	const port = app.siteConfig.get('emailPort');
	const user = app.siteConfig.get('emailUser');
	const pass = app.siteConfig.get('emailPass');

	if (app.siteConfig.get('siteUrlWithProtocolAndHost') == '') {
		console.log('В глобальных переменных отсутствует полный адрес до сайта. Для отправки email установите значение переменной полного адреса сайта в настройках.');

		app.sendEmail = () => {
			throw new Error('В глобальных переменных отсутствует полный адрес до сайта. Для отправки email установите значение переменной полного адреса сайта в настройках.');
		}

		return;
	}

	if ([!!host, !!port, !!user, !!pass].includes(false)) {
		console.log(`Отсутствуют данные для авторизации почтового сервиса.`);

		app.sendEmail = () => {
			throw new Error('Отсутствуют данные для авторизации почтового сервиса.');
		}

		return;
	}

	const config = {
		host,
		port,
		auth: { user, pass },
		secure,
		tls
	};

	const transporter = nodemailer.createTransport(config);

	app.sendEmail = data => new Promise((resolve, reject) => {

		if ([!!data.to, !!data.html, !!data.subject].includes(false)) {
			throw new Error('Отсутствуют необходимые поля для отправки сообщения');
		}

		data.from = user;

		transporter.sendMail(data, function (error, info) {
			if (error) return reject(error);

			return resolve({ status: 'ok' });
		});
	});
};

module.exports.init = init;