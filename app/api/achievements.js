exports.get = (req, res, next) => {
	const Model = req.app.Model;
	
	return Model.achievements.get(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.update = (req, res, next) => {
	const Model = req.app.Model;
	
	return Model.achievements.upd(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.delete = (req, res, next) => {
	const Model = req.app.Model;

	return Model.achievements.del(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}


exports.add = (req, res, next) => {
	const Model = req.app.Model;

	return Model.achievements.add({}).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}