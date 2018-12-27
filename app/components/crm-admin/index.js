const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		if (locals.user.admin === false) return Promise.resolve([, "Фрагмент доступен только для администратора"]);

		var [error, connectedCRM] = await app.db.execQuery(`SELECT * FROM connected_crm`);

		dataViews.connectedCRM = connectedCRM;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}