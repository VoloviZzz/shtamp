const path = require('path');
const request = require('request');
const memoryBookApi = require('../../memory-book-api');
const retailApi = require('../../retail-api');
const searchApiLib = require('../../libs/search-deads');

module.exports = (app) => {

	const Model = app.Model;

	return async ({ locals, session, dataViews = {} }) => {
		// logic...

		let defaultData = {
			id: locals.dynamicRouteNumber,
		};

		let data = {};

		let memory = [];
		let visitedGraves = [];

		let body = false;

		var entrusting = [];

		if (!!locals.user.id === true) {
			var [error, entrusting] = await Model.entrusting.get_entrusting({ 'client': locals.user.id, 'pers': defaultData.id });

			var mods = [];
			var goods_mods = '';

			for (var e of entrusting) {
				mods.push(e.mods);
			}

			if (mods.length > 0) {
				goods_mods = mods.join(',');

				var goods = await retailApi.query(`get_goods`, { ids: goods_mods });

				dataViews.goods = goods;
			}
		}

		dataViews.entrusting = entrusting;

		data = Object.assign(defaultData, data);

		try {
			body = await searchApiLib.getDeadInfo(data.id);
		}
		catch (e) {
			console.log(e);
			return Promise.resolve([null, 'Не удалось получить информацию об умершем'])
		}

		try {
			[, visitedGraves] = await Model.visitedGraves.get({ client_id: locals.user.id, grave_id: defaultData.id });
		}
		catch (e) {
			console.log('Ошибка получение посещаемых захоронений');
			console.log(e);
		}

		dataViews.visitGrave = false;

		if (visitedGraves.length > 0) {
			dataViews.visitGrave = true;
		}

		let necs = [];
		let bio = [];
		let photos = { data: [] };

		const getMemoryParams = {
			dead_id: data.id,
			author_id: locals.user.id,
			common_id: '74-3435-' + data.id
		};

		const getPhotosParams = {
			dead_id: '74-3435-' + data.id,
			author_id: locals.user.id
		};

		if (locals.user.adminMode === false) {
			getMemoryParams.state = '3';
			getPhotosParams.state = '3';
		}

		try {
			memory = await getMemory(['necrologues', 'biographies'], getMemoryParams);
			necs = memory[0];
			bio = memory[1];
		} catch (error) {
			console.log('Ошибка выполнения API MEMORY_BOOK: ');
			console.log(error.toString());
		}

		try {
			photos = await memoryBookApi.photos.getPhotos(getPhotosParams);
		} catch (error) {
			console.log(error);
		}

		const resPhoto = [];

		for (let photo of photos.data) {
			var [error, client] = await Model.clients.get({ id: photo.author_id });

			if (error) {
				console.log(error);
				continue;
			}

			client = client[0] || {};

			photo.client = client;

			resPhoto.push(photo);
		}

		body = JSON.parse(body);
		body.data.bio = bio;
		body.data.necs = necs;
		body.data.photos = resPhoto;


		if (body.data.grave.rat_unknown == 1) {
			locals.route.title = 'Неопознанное захоронение';
		}
		else if (body.data.grave.rat_noname == 1) {
			locals.route.title = 'Безымянное захоронение';
		} else {
			locals.route.title = body.data.grave.dead_name;
		}

		var g = body.data.grave;

		g.number = String(g.id);
		while (g.number.length < 6) g.number = "0" + g.number;

		if (g.place) {
			g.placeNumber = String(g.place);
			
			while (g.placeNumber.length < 6) g.placeNumber = "0" + g.placeNumber;
		}

		dataViews.flowers = [];
		dataViews.data = body.data;
		dataViews.memoryBookPhotoPath = memoryBookApi.getPhotoPath();
		dataViews.g = g;

		return new Promise((resolve, reject) => {
			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}

function getMemory(data = [], options = {}) {

	return new Promise((resolve, reject) => {

		const values = JSON.stringify(data);
		options = JSON.stringify(options);

		request.post(memoryBookApi.memoryBookUrl + 'memory.get', { form: { values, options } }, (error, response, body) => {
			if (error) {
				return reject(error);
			}

			body = JSON.parse(body);
			return resolve(body);
		})
	})
}