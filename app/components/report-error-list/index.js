const path = require('path');
const Helpers = require('../../libs/Helpers');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		var [error, result] = await Model.reportError.get({ orderBy: 'status DESC, id DESC' });
		if(error) return Promise.resolve(error.message);
		
		const errorReports = result;

		let resArray = {};

		errorReports.map(r => {
			let reportCreated = r.created;
			reportCreated = Helpers.formatDate(reportCreated, 'dd MMMM yyyy');

			if (!!resArray[reportCreated] === false) {
				resArray[reportCreated] = [];
			}

			resArray[reportCreated].push(r);
		})

		dataViews.errorsReports = resArray;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}