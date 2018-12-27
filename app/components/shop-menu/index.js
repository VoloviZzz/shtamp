const path = require('path');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise(async (resolve, reject) => {

			const catId = locals.dynamicRouteNumber || '';
			const categoriesParams = {};

			if (locals.user.adminMode == false) {
				categoriesParams.public = '1';
			}

			var [error, goodsCategories] = await app.Model.goodsCategories.get(categoriesParams);
			if (error) return resolve([error, error.message]);

			const resultCatsObj = {};

			goodsCategories.forEach((cat) => {
				resultCatsObj[cat.id] = cat;
			})

			const catsTree = getTree(resultCatsObj);

			dataViews.catsTree = catsTree;
			dataViews.catId = catId;

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);


				return resolve([err, str]);
			});
		})
	}
}

function getTree(dataset) {
	let tree = {};

	for (let key in dataset) {
		let node = dataset[key];

		if (!node['parent_id']) {
			tree[key] = node;
		}
		else {
			if (dataset[node['parent_id']]) {
				if (!!dataset[node['parent_id']]['childs'] === false) dataset[node['parent_id']]['childs'] = {};

				dataset[node['parent_id']]['childs'][key] = node;
			}
		}
	}

	return tree;
}