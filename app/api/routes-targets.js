const Model = require('../models');
const db = require('../libs/db');

exports.add = async (req, res, next) => {
	var [error] = await Model.routesTargets.add();
	if (error) return { message: error.message };

	return (req, res, next) => res.redirect(`back`);
}

exports.delete = async (req, res, next) => {
	var [error] = await Model.routesTargets.delete({ id: req.body.id });
	if (error) return { message: error.message };

	var [error] = await db.execQuery(`UPDATE routes SET target_id = NULL WHERE target_id = '${req.body.id}'`);
	if (error) return { message: error.message };

	return { status: 'ok' };
}

exports.update = async (req, res, next) => {
	var [error] = await Model.routesTargets.update(req.body);
	if (error) return { message: error.message };

	return { status: 'ok' };
}