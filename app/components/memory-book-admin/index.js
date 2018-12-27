const path = require('path');
const memoryBookApi = require('../../memory-book-api');
const Pagination = require('../../libs/pagination');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		const currentPage = locals.reqQuery.page || 1;
		const part = (currentPage - 1) > 0 ? currentPage - 1 : 0;

		const getMemoryParams = {
			count: 10,
			stateIn: [0, 2],
			part,
		};

		let memoryResult;

		try {
			memoryResult = await memoryBookApi.get('deads2', getMemoryParams);
		} catch (e) {
			console.log('Ошибка api "memory_book":');
			console.log(e);

			if (e.code == "ECONNREFUSED") {
				return Promise.resolve([e, '<b>Сервер "Книги памяти" временно недоступен.</b>']);
			} else if (e.code == "ENOTFOUND") {
				return Promise.resolve([e, '<b>Не удалось подключиться к серверу "Книги памяти".</b>']);
			} else {
				return Promise.resolve([e, '<b>В работе "Книги памяти" что-то пошло не так.</b>']);
			}
		}

		const { deads, countDeads } = memoryResult;

		const pagination = new Pagination({ allCountPosts: countDeads, countOnPage: getMemoryParams.count, currentPage: currentPage });

		dataViews.pagination = pagination;
		dataViews.deads = deads;
		dataViews.countDeads = countDeads;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}