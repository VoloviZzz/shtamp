const ejs = require('ejs');
const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...
		const fragmentId = locals.fragment.id;
		var [error, value] = await Model.fragments.getFragmentsData({ fragment_id: fragmentId });
		if (error) throw new Error(error);

		if (value.length > 0) {
			value = JSON.parse(value[0].data).content.value;
		} else {
			value = '';
		}

		const renderView = (viewName) => {
			const dir = path.join(app.viewsDir, 'includes');

			if (!!viewName === false) {
				return 'renderView: отсутствует название представления.';
			}

			const viewPath = path.join(dir, viewName);
			let view;

			return app.ejs.renderFile(viewPath, locals, (error, string) => {
				if (error) {
					console.log('-----------error: ', error);
					return `<pre>${error.message}</pre>`
				}

				return string;
			});
		};

		if (locals.user.adminMode == false) {
			try {
				value = app.ejs.render(value, { renderView });
			} catch (e) {
				value = e.toString();
			}
		}

		dataViews.value = value;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}