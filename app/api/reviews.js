const Model = require('../models');

exports.add = (req, res, next) => {

	const Model = req.app.Model;
	const { text, targetType, targetId } = req.body;
	
	const creator = req.session.user.id || 0;

	return Model.reviews.add({ text, creator, targetType, targetId }).then(([error, results]) => {
		if (error) return { status: 'bad', message: error.message, error };

		return { status: 'ok' };
	})
}

exports.addCategory = async (req, res, next) => {
	try {
		if (!!req.body.title === false) {
			throw new Error('Отсутствует title');
		}

		await Model.reviews.addCategory(req.body);
		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}

exports.togglePublished = (req, res, next) => {
	const Model = req.app.Model;
	const { id, published } = req.body;

	return Model.reviews.upd({ target: 'published', value: published, id }).then(([error, results]) => {
		if (error) return { status: 'bad', message: error.message, error };

		return { status: 'ok' };
	})
}

exports.delete = (req, res, next) => {

	const { id } = req.body;
	const Model = req.app.Model;

	return Model.reviews.del({ id }).then(([error, results]) => {
		if (error) return { status: 'bad', message: error.message, error };

		return { status: 'ok' };
	})
}