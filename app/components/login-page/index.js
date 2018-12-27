const path = require('path');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise((resolve, reject) => {

			dataViews.referer = locals.reqReferer || '';

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, null]);

				return resolve([err, str]);
			});
		})
	}
}