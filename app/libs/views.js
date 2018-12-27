const Model = require('../models');
const db = require('./db');

exports.createView = async function createView(req, res, next) {

	let path = req.url;
	let publicPaths = /\/js\/|\/css\/|.jpg|.png/;

	if (publicPaths.test(path) === false) {

		var [error, insertId] = await Model.views.add({ visitId: req.session.user.visitId, visitorId: req.session.user.visitorId, path });

		if (error) {
			console.log('Создание нового просмотра не удалось');
			console.log(e);
			return next();
		}

		if (req.session.user.visitId) {
			await db.execQuery(`UPDATE visits SET count_views = count_views + 1 WHERE id = ${req.session.user.visitId}`);
		} else {
			console.error('Не удалось обновить количество просмотров для визита');
		}
	};

	return next();
}