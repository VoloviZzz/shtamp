exports.setValue = async (req, res, next) => {
	const memoryBookSettings = { target: req.body.target, value: req.body.value };
	await app.siteConfig.set(memoryBookSettings);
	
	return (req, res, next) => {
		res.redirect('back');
	}
}