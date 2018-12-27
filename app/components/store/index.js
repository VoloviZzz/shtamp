const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		if (locals.user.admin === false) return Promise.resolve([, "Фрагмент доступен только для администратора"]);

		dataViews.category = await Model.categoiesList.getcat();
		dataViews.item = await Model.categoiesList.getitem();
		dataViews.tags = await Model.categoiesList.gettag();
		dataViews.groups = await Model.categoiesList.getgroup();

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}
