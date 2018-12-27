const Model = require('../models');

exports.constructMenu = function ({ menu_id = false }) {
	return Model.menu.getMenuItems({ group_id: menu_id }).then(([error, result]) => {
		if (error) throw new Error(error);

		const resultMenuObj = {};

		result.forEach((menuItem) => {
			resultMenuObj[menuItem.id] = menuItem;
		})

		return getTree(resultMenuObj);
	});
};

function getTree(dataset) {
	let tree = {};

	for (let key in dataset) {
		let node = dataset[key];

		if (!node['parent_id']) {
			tree[key] = node;
		}
		else {
			if (!!dataset[node['parent_id']]['childs'] === false) dataset[node['parent_id']]['childs'] = {};

			dataset[node['parent_id']]['childs'][key] = node;
		}
	}

	return tree;
}