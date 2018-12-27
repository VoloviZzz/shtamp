const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		var [error, callbacks] = await Model.callbacks.get();
		if(error) throw new Error(error);

		dataViews.callbacks = callbacks;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, '<pre>' + err.toString() + '</pre>']);

				return resolve([err, str]);
			});
		})
	}
}