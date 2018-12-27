module.exports = async (req, res, next) => {

	const { db } = req.app.parent;

	db.execQuery(`SELECT * FROM goods_cats ORDER BY parent_id`).then(([error, rows]) => {
		if (error) return next(error);

		const categories = [...rows];
		const categoriesTree = createTree(categories);
		const unusedCategoriesIds = getUnusedCategories(categoriesTree);
		const unusedCategories = categories.filter(({ id }) => unusedCategoriesIds.includes(String(id)));

		res.json({ status: 'ok', data: { categories: unusedCategories } });
	})
}

function createTree(categories, sub = null) {
	const a = {};

	for (const category of categories) {
		if (sub == category['parent_id']) {

			const b = createTree(categories, category.id);

			if (Object.keys(b).length > 0) {
				a[category.id] = b;
			}
			else {
				a[category.id] = false;
			}
		}
	}

	return a;
}

function getUnusedCategories(tree) {
	const a = [];

	for (const id of Object.keys(tree)) {
		const node = tree[id];

		if (node === false) {
			a.push(id);
		} else {
			var b = getUnusedCategories(node);
			a.push(...b);
		}
	}

	return a;
}