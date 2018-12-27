const path = require('path');

module.exports = (app) => {

	const Model = app.Model;
	const { db } = app;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		try {
			const routeParam = locals.dynamicRouteNumber;

			var [error, [post]] = await Model.posts.get({ id: routeParam });


			if(!!post === false) {
				return Promise.resolve([, 'Публикая не найдена']);
			}

			var [error, postCategories] = await app.db.execQuery(`SELECT * FROM post_categories WHERE target_id = '${post.target}'`);

			const similarPostsParams = {
				limit: '5',
				orderBy: 'id desc'
			};

			if (post.cat != '0') {
				similarPostsParams.category = post.cat;
			}

			similarPostsParams.target = post.target;

			var [error, similarPosts] = await Model.posts.get(similarPostsParams);

			dataViews.post = post;
			dataViews.postCategories = postCategories;
			locals.route.title = post.title;
			dataViews.fragment = locals.fragment;
		} catch (e) {
			console.log(e);
			return Promise.resolve([, 'Что-то пошло не так']);
		}

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}