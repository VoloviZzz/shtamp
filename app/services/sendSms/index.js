const smscPackage = require('node-smsc');
const Model = require('../../models');

module.exports.init = async (app) => {

	const result = await Promise.all([
		Model.siteConfig.get({ target: 'smsAuthLogin' }),
		Model.siteConfig.get({ target: 'smsAuthPassword' }),
		Model.siteConfig.get({ target: 'smsAuthHashed' }),
	]);

	var [error, [{ value: login } = {}]] = result[0];
	var [error, [{ value: password } = {}]] = result[1];
	var [error, [{ value: hashed } = {}]] = result[2];

	if ([login, password, hashed].includes(undefined) === true) {
		console.error('Нет данных для подключения к сервису отправки СМС');

		app.smsc = {
			send() {
				throw new Error('Нет данных для подключения к сервису отправки СМС')
			}
		};

		return false;
	}

	app.smsc = smscPackage({
		login: login,
		password: password, // password is md5-hashed implicitly unless "hashed" option is passed.
		hashed: !!hashed
	});
};