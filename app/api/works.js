exports.update = (req, res, next) => {
	const Model = req.app.Model;
	
	return Model.works.upd(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.delete = (req, res, next) => {
	const Model = req.app.Model;

	return Model.works.del(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}


exports.add = (req, res, next) => {
	const Model = req.app.Model;

	return Model.works.add({}).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}