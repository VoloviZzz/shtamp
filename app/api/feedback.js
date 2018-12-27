const db = require('../libs/db');

exports.add = async (req, res, next) => {
	const { feedback } = req.app.Model;

	req.body.url = req.headers.referer;

	return feedback.add(req.body).then(([error, result]) => {
		if (error) return { status: 'bad', message: error.message, error };

		return { status: 'ok' };
	})
}

exports.upd = async (req, res, next) => {
	const { id, value, target } = req.body;

	if (!!id === false) return { status: 'bad' };
	if (!!value === false) return { status: 'bad' };
	if (!!target === false) return { status: 'bad' };

	return db.execQuery(`UPDATE feedback SET ${req.body.target} = '${req.body.value}' WHERE id = '${req.body.id}'`).then(([error]) => {
		if (error) return { status: 'bad' };

		return { status: 'ok' };
	})
}