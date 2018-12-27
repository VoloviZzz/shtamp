const path = require('path');
const Model = require('../../models');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise(async (resolve, reject) => {

			let news_id, object_alias;
			let goodsPositions = [];
			let goodsCategories = [];

			news_id = locals.dynamicRouteNumber;

			if (!!news_id === false) return resolve([, "Отсутствует аргумент для динамического фрагмента страницы"])

			const getCategoriesParams = {
				id: news_id
			};

			const getCategoriesByParentParams = {
				parent_id: news_id
			};

			if (locals.user.adminMode == false) {
				getCategoriesParams.public = '1';
				getCategoriesByParentParams.public = '1';
			}

			var [getCatsError, categories] = await Model.goodsCategories.get(getCategoriesParams);
			if (getCatsError) throw new Error(getCatsError);

			if (categories.length < 1) return resolve([, 'Категория не найдена']);

			[, categoriesByParent] = await Model.goodsCategories.get(getCategoriesByParentParams);

			[, [currentCat]] = await Model.goodsCategories.get({ id: news_id });
			dataViews.currentCat = currentCat;

			if (categoriesByParent.length > 0) {
				dataViews.tpl = 'cats-list';
				dataViews.data = categoriesByParent;
			}
			else {
				[, goodsPositions] = await Model.goodsPositions.get({ cat_id: news_id });
				dataViews.tpl = 'pos-list';
				dataViews.data = goodsPositions;
			}

			locals.route.title = currentCat.title;

			dataViews.fragment = locals.fragment;

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);


				return resolve([err, str]);
			});
		})
	}
}