const path = require('path');
const Pagination = require('../../libs/pagination');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const { fragment } = locals;

		const currentTarget = fragment.settings.target;
		const currentCategory = locals.dynamicRouteNumber ? locals.dynamicRouteNumber : ('category' in fragment.settings ? fragment.settings.category : false);
		const dynamicCategory = locals.dynamicRouteNumber ? true : false;

		var templatePath;
		var posts = [];
		var [error, postTargets] = await app.db.execQuery(`SELECT * FROM post_targets`);

		fragment.settings.showPagination = fragment.settings.showPagination || '1';
		fragment.settings.orderByDesc = fragment.settings.orderByDesc || '1';
		fragment.settings.showPublishedTime = fragment.settings.showPublishedTime || '1';

		if (!!currentTarget === false) {
			templatePath = path.join(__dirname, 'settings.ejs')
		} else {
			templatePath = path.join(__dirname, 'template.ejs');

			var [error, postCategories] = await app.db.execQuery(`SELECT * FROM post_categories WHERE target_id = '${currentTarget}'`);
			if (error) {
				console.log('get post_categories error:', error);
			}

			// пагинация
			var publicPosts = locals.user.adminMode !== true ? `AND public = '1'` : '';
			var categoryPosts = currentCategory ? `AND cat = ${currentCategory}` : '';
			var [, [{ all_count: countReviews }]] = await app.db.execQuery(`SELECT COUNT(id) as all_count FROM posts WHERE target = '${currentTarget}' ${publicPosts} ${categoryPosts}`);
			const pagination = new Pagination({ countOnPage: fragment.settings.countPosts || 12, allCountPosts: countReviews, currentPage: locals.reqQuery.page, pageUrlQuery: locals.reqQuery });
			// ----------

			const postsGetParams = {
				target: currentTarget,
				orderBy: fragment.settings.orderByDesc == '0' ? 'id' : 'id DESC',
				limit: `${pagination.options.offset}, ${pagination.options.countOnPage}`
			};

			if (locals.user.adminMode == false) {
				postsGetParams.public = '1';
			}

			if (currentCategory !== false) {
				postsGetParams.category = currentCategory;
			}

			var [error, posts] = await Model.posts.get(postsGetParams);

			dataViews.posts = posts;
			dataViews.pagination = pagination;
			dataViews.postCategories = postCategories;
			dataViews.currentCategory = currentCategory;
			dataViews.dynamicCategory = dynamicCategory;
		}

		dataViews.postTargets = postTargets;
		dataViews.currentTarget = currentTarget;
		dataViews.fragment = locals.fragment;

		return new Promise((resolve, reject) => {
			app.render(templatePath, dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}