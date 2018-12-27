exports.saveOffer = (req, res, next) => {
	const Model = req.app.Model;
	console.log(req.body);
	var keys = Object.keys(req.body);
	var arg = {
		value: req.body['title'],
		target: 'title',
		id: req.body['id']
	}
	console.log(arg);

	return Model.offersList.upd(arg)
		.then(() => {
			var keys = Object.keys(req.body);
			var arg = {
				value: req.body['img'],
				target: 'img',
				id: req.body['id']
			}
			return Model.offersList.upd(arg)
		})
		.then(() => {
			var keys = Object.keys(req.body);
			var arg = {
				value: req.body['link'],
				target: 'link',
				id: req.body['id']
			}
			return Model.offersList.upd(arg)
		})
		.then(() => {
			var keys = Object.keys(req.body);
			var arg = {
				value: req.body['desc'],
				target: '`desc`',
				id: req.body['id']
			}
			console.log(arg);
			return Model.offersList.upd(arg)
		})
		.then(() => {
			return { status: 'ok' };
		});
}

exports.activeToggle = (req, res, next) => {
	const Model = req.app.Model;
	return Model.offersList.upd(req.body).then(([error, result]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.addOffer = (req, res, next) => {
	const Model = req.app.Model;
	return Model.offersList.add().then(([error, rows]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.removeOffer = (req, res, next) => {
	const Model = req.app.Model;
	return Model.offersList.del({ id: req.body.id }).then(([error, rows]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}
