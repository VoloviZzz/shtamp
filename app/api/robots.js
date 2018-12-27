exports.update = async (req, res, next) => {
	try {
		await app.siteConfig.set({ target: 'robotsValue', value: req.body.value });
		await app.siteConfig.refresh();
		return (req, res, next) => res.redirect('back');
	} catch (error) {
		console.log(error);
		return { message: error.message };
	}
}