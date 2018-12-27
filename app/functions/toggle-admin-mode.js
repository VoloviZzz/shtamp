module.exports = function (req, res, next) {
	if (!!req.session.user.admin === false) return res.json({ status: 'bad', message: `Нет доступа к данной функции` });

	req.session.user.adminMode = !req.session.user.adminMode;
	res.json({ status: 'ok' });
}