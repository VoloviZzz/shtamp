const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const user_id = locals.user.id;
		var client = {};
		const { fragment } = locals;

		fragment.settings.onlyRegistred = fragment.settings.onlyRegistred || 0;


		if (user_id !== false) {
			var [error, client] = await Model.clients.get({ id: user_id });

			if (client.length > 0) {
				client = client[0];
				client.fio = `${client.surname} ${client.firstname} ${client.patronymic}`
			}
		}

		var [error, feedbackFragments] = await app.db.execQuery(`SELECT id, settings FROM fragments WHERE component_id = '${fragment.component_id}'`);

		var categories = feedbackFragments.reduce((obj, item) => {
			var settings = JSON.parse(item.settings) || {};

			if (settings.category) {
				obj[settings.category] = settings;
			}

			return obj;
		}, {});

		categories = Object.keys(categories);

		dataViews.messages = [];
		dataViews.categories = categories;

		if (locals.user.id) {
			var [error, clientMessages] = await Model.feedback.get({ client_id: locals.user.id });

			dataViews.messages = clientMessages;
		}

		dataViews.client = client;
		dataViews.fragment = locals.fragment;
		dataViews.formTitle = locals.fragment.settings.title || '';

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}
