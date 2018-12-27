exports.auth = async (req, res, next) => {
	try {
		await app.siteConfig.set({ target: 'smsHost', value: req.body.host });
		await app.siteConfig.set({ target: 'smsPort', value: req.body.port });
		await app.siteConfig.set({ target: 'smsUser', value: req.body.user });
		await app.siteConfig.set({ target: 'smsPass', value: req.body.pass });

		await app.siteConfig.refresh();
		return (req, res, next) => res.redirect('back');
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}

exports.setVariable = async (req, res, next) => {
	try {
		await app.siteConfig.set({ target: req.body.target, value: req.body.value });

		await app.siteConfig.refresh();
		return (req, res, next) => res.redirect('back');
	} catch (error) {
		console.error(error);
		return { message: error.message };
	}
}