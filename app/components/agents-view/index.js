const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const agentId = locals.dynamicRouteNumber;

		if (!!agentId === false) {
			return Promise.resolve([, 'Страница не найдена']);
		}

		var [error, [agent]] = await Model.agents.get({ id: agentId });

		if (!!agent === false) {
			return Promise.resolve([, 'Страница не найдена']);
		}

		dataViews.agent = agent;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}