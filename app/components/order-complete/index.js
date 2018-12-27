const path = require('path');

module.exports = (app) => {
	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const [, [order]] = await app.Model.orders.get({hash: locals.dynamicRouteAlias});
		
		if(!!order === false) return Promise.resolve([, 'Страница не найдена']);

		const [, orderGoods] = await app.Model.ordersGoods.get({order_id: order.id});

		dataViews.order = order;
		dataViews.orderGoods = orderGoods;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}