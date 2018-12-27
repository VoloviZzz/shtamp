const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const [[, newOrders], [, inWorkOrders], [, finishedOrders]] = await Promise.all([
			Model.orders.get({ status: 1 }),
			Model.orders.get({ status: 2 }),
			Model.orders.get({ status: 3 }),
		])

		dataViews.orders = {
			newOrders, inWorkOrders, finishedOrders
		};

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}