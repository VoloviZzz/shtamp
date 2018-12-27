const path = require('path');

module.exports = (app) => {
	const { Model } = app;
	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const { id } = locals.user;

		if (!!id === false) return Promise.resolve([, 'Ошибка доступа компонента']);

		var [error, [user]] = await Model.clients.get({ id });

		dataViews.user = user;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}