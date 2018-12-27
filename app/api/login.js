const Model = require('../models');

exports.login = async function (req, res, next) {
	const data = req.body;
	let err = false;
	[err, client] = await Model.clients.get({ phone: data.phone, password: data.password });
	if (err) throw new Error(err);

	if (client.length < 1) return { status: 'bad', message: "Пользоваетль с такими данными отсутствует" };
	if (client.length > 1) return { status: 'bad', message: 'Не удалось получить пользователя. Попробуйте позже' };

	client = client[0];

	if (!!client.confirmed === false) {
		return { status: 'not confirmed', message: 'Аккаунт не подтвержден. Для подтверждения перейдите на почту, на которую была проивзедена регистрация, и следуйте дальнейшим инструкциям. Если письма нет во входящих, проверьте папку "Спам". Выслать письмо повторно?' }
	}

	req.session.user.clientName = client.name;
	req.session.user.id = client.id;
	req.session.user.admin = client.admin;
	req.session.user.root = client.root;
	
	return { status: 'ok', data: { client }, referer: req.body.referer !== req.url ? req.body.referer : '/' };
}