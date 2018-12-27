const path = require('path');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise((resolve, reject) => {
			const { slides = [] } = locals.content;

			dataViews.slides = slides;

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}