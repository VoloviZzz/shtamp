module.exports = function ping(req, res, next) {
	res.json({ status: 'ok' });
}