const Model = require('../models');

exports.addMenuItem = async function (req, res, next) {
	const [addError, resQuery] = await Model.menu.addMenuItem(req.body);
	if (addError) return { status: 'bad', message: addError.message }

	return { status: 'ok', data: req.body }
}

exports.deleteMenuItem = async function (req, res, next) {
	return await Model.menu.getMenuItems({ parent_id: req.body.menu_id }).then(([error, childs]) => {
		if (childs.length > 0) return Promise.reject({ message: 'Перед удалением нужно удалить дочерние элементы' });
		return Model.menu.deleteMenuItem({ id: req.body.menu_id });
	}).then((data) => {
		return Promise.resolve({ status: 'ok', data: req.body });
	})
		.catch((error) => {
			return Promise.resolve({ status: 'bad', message: error.message });
		})
}

exports.addMenuGroup = async function (req, res, next) {
	return Model.menu.addMenuGroup(req.body).then(([error, menuGroupId]) => {
		return Model.routes.upd({ id: req.body.route_id, menu: menuGroupId });
	}).then(([error, result]) => {
		return Model.routes.get({ id: req.body.route_id });
	}).then(([error, route]) => {
		req.app.locals.routesList[route.url] = route;
		return Promise.resolve({ status: 'ok', data: req.body })
	});
}

exports.updMenuItem = async function (req, res, next) {
	const { id, target, value } = req.body;
	return await Model.menu.updMenuItem({ id, target, value }).then(([error, result]) => {
		if (error) return Promise.resolve({ message: error.message })
		return Promise.resolve({ status: 'ok', data: req.body })
	})
}