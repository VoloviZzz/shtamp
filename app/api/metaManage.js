const Model = require('../models');

exports.add = async (req, res, next) => {

	var [error, metaData] = await Model.metaManage.get(req.body);
	if (error) return { message: error.message };

	let action;

	if (metaData.length < 1) {
		action = 'add';
	} else {
		action = 'update';
		req.body.id = metaData[0].id;
	}

	const controller = actions[action];
	var [error] = await controller(req.body);
	if (error) return { status: 'bad', message: error.message };

	return { status: 'ok' };
}

const actions = {
	update(data) {
		return Model.metaManage.update(data);
	},

	add(data) {
		return Model.metaManage.add(data);
	}
};