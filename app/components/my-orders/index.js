const path = require('path');

module.exports = (app) => {
	const Model = app.Model;
	return async ({ locals, session, dataViews = {} }) => {
		// logic...
		const client_id = locals.user.id;

		if (!!client_id === false) return Promise.resolve([null, `Ошибка доступа компонента`]);

		const [errorOrders, orders] = await Model.orders.get({ client_id });

		for (let order of orders) {
			const { id } = order;
			const [, orderGoods] = await Model.ordersGoods.get({ order_id: id });
			order.goods = orderGoods;
		}

		dataViews.orders = orders;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}