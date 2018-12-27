const url = require('url');

exports.addVisited = (req, res, next) => {
	return req.app.Model.visitedGraves.add({ client_id: req.session.user.id, grave_id: req.body.id }).then(() => {
		return { status: 'ok' };
	}).catch(error => {
		console.log(error);
		return { message: error.toString() };
	});
}

exports.delVisited = (req, res, next) => {
	return req.app.Model.visitedGraves.del({ client_id: req.session.user.id, grave_id: req.body.id }).then(() => {
		return { status: 'ok' };
	}).catch(error => {
		console.log(error);
		return { message: error.toString() };
	});
}