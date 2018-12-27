exports.delete = (req, res, next) => {
	const Model = req.app.Model;
	return Model.photos.delete({ id: req.body.id }).then(([error]) => {
		if (error) return { message: error.message };
		return { status: 'ok' };
	})
}