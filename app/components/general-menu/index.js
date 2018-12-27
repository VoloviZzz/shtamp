const Model = require('../../models');
const path = require('path');
const Menu = require('../../libs/menu');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise(async (resolve, reject) => {

			let menuTree = false;

			var [error, route] = await Model.routes.get({ id: locals.route.id });

			if (!!route.menu_id === true) {
				menuTree = await Menu.constructMenu({ menu_id: route.menu_id });
			}

			menuTree = Object.values(menuTree).sort((a, b) => {
				return b.priority - a.priority;
			})

			const [, menuGroups] = await Model.menu.getMenuGroups();

			dataViews.route = route;
			dataViews.menuTree = menuTree;
			dataViews.menuGroups = menuGroups;

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}