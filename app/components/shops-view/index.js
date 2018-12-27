const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const shopId = locals.dynamicRouteNumber;

		const [, [shop]] = await Model.shopsList.get({ id: shopId });

		if (!!shop === false) return Promise.resolve([, 'Страница не найдена'])

		if (locals.route.use_component_title) {
			locals.route.title = shop.title;
		}

		if (shop.phones) {
			shop.phones = shop.phones.split(',');
		} else {
			shop.phones = [];
		}

		if (shop.schedule) {
			shop.schedule = JSON.parse(shop.schedule);
		} else {

		}

		[error, photos] = await Model.photos.get({ target: 'shop', target_id: shop.id });

		if (error) {
			console.error(error);
			return Promise.resolve([, "что-то пошло не так"]);
		}

		var [error, aliases] = await Model.aliases.get({ route_id: locals.route.id, params: locals.URIparams });
		if (error) {
			console.error(error);
			return Promise.resolve([, "что-то пошло не так"]);
		}

		dataViews.aliases = aliases;


		dataViews.shop = shop;
		dataViews.photos = photos;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}