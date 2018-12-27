const path = require('path');

module.exports = (app) => {

	const Model = app.Model;
	const { db } = app;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		try {
			const routeParam = locals.dynamicRouteNumber;
			const { fragment } = locals;

			const showSimilarPosts = fragment.settings.showSimilarPosts = fragment.settings.showSimilarPosts || '1';
			const countSimilarPosts = fragment.settings.countSimilarposts = fragment.settings.countSimilarposts || '3';
			const alwaysRandomSimilarPosts = fragment.settings.randomSimilarPosts = fragment.settings.randomSimilarPosts || '1';

			var [error, [post] = [false]] = await Model.posts.get({ id: routeParam });
			if (error) throw new Error(error);
			if (!!post === false) return Promise.resolve([, 'Публикая не найдена']);

			var similarPosts = null;

			var [error, postCategories] = await app.db.execQuery(`SELECT * FROM post_categories WHERE target_id = '${post.target}'`);

			if (showSimilarPosts == '1') {

				const andWhereCat = post.cat ? `AND cat = '${post.cat}'` : '';
				const andWheretarget = post.target ? `AND target = '${post.target}'` : '';

				const paramsForGetSimilarPosts = alwaysRandomSimilarPosts == '1' || !post.similar_posts_id
					? `id <> '${post.id}' ${andWhereCat} ${andWheretarget} ORDER BY RAND() LIMIT ${countSimilarPosts}`
					: `id IN (${post.similar_posts_id})`;

				[, similarPosts] = await app.db.execQuery(`SELECT * FROM posts WHERE ${paramsForGetSimilarPosts}`);

				const similarIds = similarPosts.reduce((prev, current) => {
					prev.push(current.id);
					return prev;
				}, []).join(',');

				post.similar_posts_id = similarIds;
			}

			if (error) {
				console.log(error);
				return Promise.resolve(["Что-то пошло не так"]);
			}

			var [error, aliases] = await Model.aliases.get({ route_id: locals.route.id });
			if (error) {
				console.log(error);
				return Promise.resolve(["Что-то пошло не так"]);
			}
			
			dataViews.similarPosts = similarPosts;
			dataViews.aliases = aliases;
			dataViews.post = post;
			dataViews.postCategories = postCategories;
			dataViews.fragment = locals.fragment;
			
			locals.route.show_title = false;
			locals.route.title = post.title;
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
