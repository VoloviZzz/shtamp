const Model = require('../models');

exports.createVisit = async function createVisit(req, res, next) {
	if (!!req.session.user.visitId === false) {

		let [error, visitId] = await Model.visits.add({ visitorId: req.session.user.visitorId, visitorIp: 'ip' in req ? req.ip.replace(/^.*:/, '') : '' });

		if (error) {
			console.log('Ошибка создания визита');
			console.log(error);
		}

		req.session.user.visitId = visitId;
	}

	return next();
}