const storage = require('../storage');

const Model = require('../models');

exports.add = async function (req, res, next) {

	const routesMap = storage.get('routesMap');
	const { dynamic, url } = req.body;

	const hasParams = url.search(/\/:params/i);

	if (dynamic == 1 && hasParams == '-1') {
		console.log('Отсутствуют параметры для динамического маршрута');
		return { status: 'bad', message: 'Отсутствуют параметры для динамического маршрута' };
	}

	if (url in routesMap) {
		return { status: 'bad', message: 'Существует маршрут с таким URL' };
	}

	var [err, route] = await Model.routes.add(req.body);
	if (err) return { status: 'bad', message: err.message, error: err };

	var [error, route] = await Model.routes.get({ id: route.id });
	if (error) return { status: 'bad', message: err.message, error: err };

	routesMap[route.url] = route;

	return { status: 'ok' };
}

exports.del = async function (req, res, next) {
	const routeId = req.body.id;
	let error = false;

	if (!!routeId === false) return { status: 'bad', message: 'Нет параметра routeId' };

	[error, route] = await Model.routes.get({ id: routeId });
	if (error) return { status: 'bad', message: err.message, error };
	if (!!route === false) return { status: 'bad', message: 'Ошибка получения маршрута' };

	if (route.delete_access == "0" && req.session.user.root != "1") {
		return { message: 'Недостаточно прав для удаления данного маршрута' }
	}

	[error, rows] = await Model.routes.del(req.body);
	if (error) return { status: 'bad', message: err.message, error };

	const routesMap = storage.get('routesMap');
	delete routesMap[route.url];

	return { status: 'ok' };
}

exports.upd = async function (req, res, next) {
	const routesMap = storage.get('routesMap');
	const routeId = req.body.id;

	if (!!routeId === false) return { status: 'bad', message: 'Нет параметра routeId' };

	var [error, oldRoute] = await Model.routes.get({ id: routeId });
	if (error) return { status: 'bad', message: err.message, error };
	if (!!oldRoute === false) return { status: 'bad', message: 'Ошибка получения маршрута' };

	if (oldRoute.edit_access == "0" && req.session.user.root != "1") {
		return { message: 'Недостаточно прав для редактирования данного маршрута' }
	}

	[error, rows] = await Model.routes.upd(req.body);
	if (error) return { status: 'bad', message: error.message, error };

	delete routesMap[oldRoute.url];

	var [error, route] = await Model.routes.get({ id: routeId });

	routesMap[route.url] = route;

	return { status: 'ok' };
}

exports.toggleActiveMenuItem = async function (req, res, next) {
	const { target, value, id } = req.body;
	var [error, rows] = await Model.routes.upd({ target, value, id });
	if (error) return { message: error.message };


	var [error, route] = await Model.routes.get({ id: id });

	const routesMap = storage.get('routesMap');
	routesMap[route.url] = route;

	return { status: 'ok' };
}