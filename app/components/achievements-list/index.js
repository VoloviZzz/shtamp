const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const { fragment } = locals;
		
		fragment.settings.countOnPage = fragment.settings.countOnPage || 10;

		var [error, achievements] = await Model.achievements.get();
		if (error) return Promise.resolve([error, error.toString()]);

		const currentPage = locals.reqQuery.page || 1;
		const countAchievementsOnPage = fragment.settings.countOnPage;
		const countPages = Math.ceil(achievements.length / countAchievementsOnPage);

		const offsetStartIndex = (currentPage - 1) * countAchievementsOnPage;
		const paginationOffsetStart = offsetStartIndex > 0
			? offsetStartIndex
			: 0;
		
		const paginationOffsetEnd = +paginationOffsetStart + +countAchievementsOnPage;

		const resArray = achievements.slice(paginationOffsetStart, paginationOffsetEnd);

		let paginationLeft = currentPage - 3;
		let paginationRight = +currentPage + 3;

		if (paginationLeft < 1) {
			paginationRight += +Math.abs(paginationLeft);
			paginationLeft = 1;
		}

		if (paginationRight > countPages) {
			paginationRight = countPages + 1;
		}

		const pagination = {
			left: paginationLeft,
			right: paginationRight,
			currentPage,
			countPages
		}

		dataViews.achievements = resArray;
		dataViews.pagination = pagination;
		dataViews.fragment = locals.fragment;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}
