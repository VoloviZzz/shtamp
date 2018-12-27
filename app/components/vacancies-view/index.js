const path = require('path');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const vacancyId = locals.dynamicRouteNumber;

		const [, [vacancy]] = await Model.vacancies.get({ id: vacancyId });

		if (!!vacancy === false) return Promise.resolve([, "Не найдено"]);

		locals.route.title = vacancy.title;

		dataViews.vacancy = vacancy;
		dataViews.fragment = locals.fragment;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}