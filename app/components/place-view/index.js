const path = require('path');
const request = require('request');
const kpruApi = require('../../libs/search-deads');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		return new Promise(async (resolve, reject) => {

			var place = await kpruApi.getPlace(locals.dynamicRouteNumber);

			dataViews.data = place;

			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		}).catch(error => {
			return Promise.resolve([error, error.toString()]);
		})
	}
}