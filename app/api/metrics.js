const Model = require('../models');

exports.add = async (req, res) => {
	await Model.metrics.add();
	return (req, res) => res.redirect('back');
}

exports.get = async (req, res) => {
	return (req, res) => res.redirect('back');
}

exports.update = async (req, res) => {
	try {
		await Model.metrics.update(req.body);
		return { status: 'ok' };
	} catch (error) {
		return { message: error.message };
	}
}

exports.delete = async (req, res) => {
	try {
		await Model.metrics.delete(req.body);
		return { status: 'ok' };
	} catch (error) {
		return { message: error.message };
	}
}