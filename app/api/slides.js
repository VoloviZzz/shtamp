const Model = require('../models');

exports.togglePublished = async (req, res, next) => {
	try {
		var [error] = await Model.slides.upd(req.body);
		if (error) throw new Error(error);

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}

exports.update = async (req, res, next) => {
	try {
		var [error] = await Model.slides.upd(req.body);
		if (error) throw new Error(error);

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}

exports.add = async (req, res, next) => {
	try {
		var [error] = await Model.slides.add(req.body);
		if (error) throw new Error(error);

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}

exports.delete = async (req, res, next) => {
	try {
		var [error] = await Model.slides.delete(req.body);
		if (error) throw new Error(error);

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}