const path = require('path');
const db = require('../../libs/db');
const Model = require('../../models');

module.exports = (app) => {

	return async ({ locals, session, dataViews } = {}) => {

		const [queryError, templatesList] = await Model.templates.get();
		if (queryError) throw new Error(queryError);

		var [error, routes] = await app.Model.routes.get();
		if (error) return Promise.resolve(['', error.message]);

		var [error, targets] = await app.Model.routesTargets.get();
		if (error) return Promise.resolve(['', error.message]);

		const routesList = routes.map(route => {
			if (route.access == "3" && !!locals.user.root === true) {
				return route;
			}
			else if (route.access != "3") {
				return route;
			}
		}).filter(r => !!r === true);

		var [error, fragments] = await Model.fragments.get();

		const fragmentsByRoute = fragments.reduce((object, fragment) => {
			const { route_id } = fragment;

			if (route_id in object === false) {
				object[route_id] = [];
			}

			object[route_id].push(fragment);
			return object;
		}, {});

		dataViews.routesList = routesList;
		dataViews.templatesList = templatesList;
		dataViews.targets = targets;
		dataViews.fragmentsByRoute = fragmentsByRoute;

		return new Promise((resolve, reject) => {
			app.ejs.renderFile(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}