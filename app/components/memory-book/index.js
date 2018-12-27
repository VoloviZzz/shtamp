const path = require('path');
const memoryBookApi = require('../../memory-book-api');

const Pagination = require('../../libs/pagination');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		let data = {
			deads: [],
			biographies: [],
			necrologues: [],
		};

		const { fragment } = locals;
		const target = fragment.settings.memoryTarget || 'all';

		const currentPage = locals.reqQuery.page || 1;
		const part = (currentPage - 1) > 0 ? currentPage - 1 : 0;

		const getMemoryParams = {
			count: 10,
			memoryTarget: target,
			state: '3',
			part
		};

		try {
			data.deads = await memoryBookApi.get('deads2', getMemoryParams);
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

		const pagination = new Pagination({ allCountPosts: data.deads.countDeads, countOnPage: getMemoryParams.count, currentPage: currentPage });

		dataViews.memoryTargetsList = [
			{ target: 'all', title: 'Всё сразу' },
			{ target: 'biographies', title: 'биографии' },
			{ target: 'necrologues', title: 'некрологи' },
			{ target: 'photos', title: 'фото' }
		];

		data.countDeads = data.deads.countDeads || 0;
		data.deads = data.deads.deads || [];
		dataViews.data = data;
		dataViews.fragment = fragment;
		dataViews.pagination = pagination;
		dataViews.currentMemoryTarget = target;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}