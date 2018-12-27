exports.index = async (req, res, next) => {
	const namesWhiteList = ['searchDeadsUrl', 'searchDeadsApiKey', 'searchDeadsApiLocCode'];

	const settingsPromise = Object.keys(req.body)
		.filter(name => namesWhiteList.includes(name))
		.map(name => app.siteConfig.set({ target: name, value: req.body[name] }));

	await Promise.all(settingsPromise);

	return (req, res, ) => res.redirect('back');
}