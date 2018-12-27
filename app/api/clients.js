const Model = require('../models');

exports.update = async (req, res, next) => {
	try {
		if (!!req.session.user.id === false) {
			return { status: 'bad' };
		}

		const { target, value, id } = req.body;

		if ([target, value, id].includes(undefined) === true) {
			return { status: 'bad', message: 'error' };
		}

		await Model.clients.upd({ target, value, id });

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { status: 'bad', message: error.message };
	}
}

exports.search = async (req, res, next) => {
	return await Model.clients.get({ search: req.body.value, limit: 25 }).then(([error, result]) => {
		if (error) return Promise.reject(error);

		return { status: 'ok', data: JSON.stringify(result) };
	}).catch(error => {
		return { status: 'bad', message: error.message };
	})
}

exports.toggleAdmin = async (req, res, next) => {
	const { target, value, id } = req.body;
	return await Model.clients.upd({ target, value, id })
		.then(([error, result]) => {
			if (error) return Promise.reject(error);

			return Promise.resolve({ status: 'ok' });
		})
		.catch(error => {
			return { status: 'bad', message: error.message };
		})
}