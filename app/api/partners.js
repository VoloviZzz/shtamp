exports.get = (req, res, next) => {
	const Model = req.app.Model;
	
	return Model.partners.get(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.update = (req, res, next) => {
	const Model = req.app.Model;
	
	return Model.partners.upd(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}

exports.delete = (req, res, next) => {
	const Model = req.app.Model;

	return Model.partners.del(req.body).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}


exports.add = (req, res, next) => {
	const Model = req.app.Model;

	return Model.partners.add({}).then(([error]) => {
		if (error) return { error, message: error.message };
		return { status: 'ok' };
	})
}