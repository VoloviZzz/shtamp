exports.add = async (req, res, next) => {
	const Model = req.app.Model;
	const { target, value } = req.body;

	var [error, result] = await Model.siteConfig.get({ target });

	if (result.length > 0) {
		var [error] = await Model.siteConfig.setValue({ target, value });
		if (error) return { message: error.message, error }

	} else {
		var [error] = await Model.siteConfig.add(req.body);
		if (error) return { message: error.message, error }
	}

	await req.app.siteConfig.refresh();
	return { status: 'ok' };
}

exports.setValue = async (req, res, next) => {
	const { target, value } = req.body;

	await req.app.siteConfig.set({ target, value })
	await req.app.siteConfig.refresh();
	return { status: 'ok' }
}

exports.delete = (req, res, next) => {
	const Model = req.app.Model;

	return Model.siteConfig.del(req.body).then(async () => {
		await req.app.siteConfig.refresh();
		return { status: 'ok' }
	})
}

exports.upd = (req, res, next) => {
	const Model = req.app.Model;

	return Model.siteConfig.upd(req.body).then(async () => {
		await req.app.siteConfig.refresh();
		return { status: 'ok' }
	})
}