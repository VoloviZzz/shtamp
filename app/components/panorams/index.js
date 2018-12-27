const path = require('path');

module.exports = (app) => {

	const Model = app.Model;
	return async ({ locals, session, dataViews = {} }) => {

		var [error, panorams] = await Model.panorams.get();

		dataViews.zip = panorams[0].zip.split('.zip')[0];

		if (locals.reqQuery.angle && locals.reqQuery.zip) {
			var angle = await Model.panorams.setAngle({
				zip: locals.reqQuery.zip,
				angle: locals.reqQuery.angle
			});
			dataViews.zip = locals.reqQuery.zip.split('.zip')[0];
		}

		dataViews.panorams = panorams;

		return new Promise((resolve, reject) => {
			const template = app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);
				return resolve([err, str]);
			});
		})
	}
}
