const path = require('path');

module.exports = (app) => {
	return ({ locals, session, dataViews } = {}) => {
		return new Promise(async (resolve, reject) => {

			const getGoodsCategoriesParams = {
				level: 0,
				orderBy: 'priority DESC'
			};

			if (locals.user.adminMode === false) {
				getGoodsCategoriesParams.public = '1';
			}

			var [error, goodsCategories] = await app.Model.goodsCategories.get(getGoodsCategoriesParams);
			
			dataViews.cats = goodsCategories || [];

			const templatePath = path.join(__dirname, 'template.ejs');
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}