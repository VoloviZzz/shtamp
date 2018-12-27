const path = require('path');
const Pagination = require('../../libs/pagination');

module.exports = (app) => {
	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		let { fragment, dynamicRouteNumber: targetId } = locals;
		targetId = targetId || 0;

		fragment.settings.onlyRegister = fragment.settings.onlyRegister || 1;
		fragment.settings.targetType = fragment.settings.targetType || 0;

		// пагинация
		const reviewsCountParams = {
			targetType: fragment.settings.targetType,
			targetId: targetId,
			public: '1',
			or: { client_id: locals.user.id }
		};

		var [error, [{ reviews_count: countReviews }]] = await Model.reviews.getCount(reviewsCountParams);
		const pagination = new Pagination({ countOnPage: 10, allCountPosts: countReviews, paramName: 'page', currentPage: locals.reqQuery.page, pageUrlQuery: locals.reqQuery });
		// ----------

		const reviewsGet = {
			public: '1',
			targetType: fragment.settings.targetType,
			targetId: targetId,
			or: {
				client_id: locals.user.id
			},
			limit: `${pagination.options.offset}, ${pagination.options.countOnPage}`,
		};

		var [error, reviews] = await Model.reviews.get(reviewsGet);
		var [, reviewsNotPublished] = await Model.reviews.get({ public: '0', targetType: fragment.settings.targetType });

		var [error, reviewsCats] = await Model.reviews.getTargets();

		dataViews.reviews = reviews;
		dataViews.reviewsNotPublished = reviewsNotPublished;
		dataViews.reviewsCats = reviewsCats;
		dataViews.fragment = fragment;
		dataViews.targetId = targetId;
		dataViews.pagination = pagination;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}