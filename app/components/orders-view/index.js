const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const orderHash = locals.dynamicRouteAlias;

		if(!!orderHash === false) {
			return Promise.resolve([, 'Страница не найдена']);
		}

		const [, [order]] = await Model.orders.get({ hash: orderHash });
		const [, orderGoods] = await Model.ordersGoods.get({ order_id: order.id });

		order.goods = orderGoods;
		dataViews.order = order;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}