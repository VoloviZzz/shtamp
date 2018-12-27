const path = require('path');

module.exports = (app) => {

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const goodsList = {};
		let goods = [];
		let cart = false;
		
		if (session.shoppingCart) {
			cart = session.shoppingCart;

			const ids = Object.keys(cart.goods)
				.map(id => id)
				.join(',');

			if (!!ids === true) {
				goods = await app.Model.goodsPositions.get({ ids });
				goods = goods[1];
			}

			goods.forEach(g => {
				goodsList[g.id] = g;
			})

		}

		dataViews.cart = cart;
		dataViews.goodsList = goodsList;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}