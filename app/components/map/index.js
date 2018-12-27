const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const { fragment } = locals;
		const { user } = locals;

		fragment.settings.center = fragment.settings.center ? fragment.settings.center.split(',') : [55.76, 37.64];
		fragment.settings.zoom = fragment.settings.zoom || 7;

		dataViews.fragment = fragment;
		dataViews.user = user;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}