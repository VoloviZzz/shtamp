const request = require('request');
const memoryBookApi = require('../memory-book-api');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const searchDeadsLib = require('../libs/search-deads');
const View = require('../View');
const { promisify } = require('util');

const unlink = promisify(fs.unlink);

exports.loadPhoto = (req, res, next) => {

	const pathsArray = [];
	const dead_id = req.query.dead_id;

	return new Promise((resolve, reject) => {

		const form = new formidable.IncomingForm();

		form.uploadDir = req.app.locals.tempUploadDir;
		form.keepExtensions = true;

		form.parse(req, function (err, fields, files) {

			Object.values(files).forEach(file => {
				const fileParsePath = path.parse(file.path);
				pathsArray.push(path.join(fileParsePath.dir, fileParsePath.base));
			})

			return resolve(pathsArray);
		});
	})
		.then(pathsArray => {

			const photos = pathsArray.map(path => {
				return fs.createReadStream(path);
			});

			var formData = {
				__function__: 'uploadPhoto',
				key: '',
				photo: photos,
				dead_id: dead_id,
				dead_code: '74-3435',
				author_id: req.session.user.id
			};

			return memoryBookApi.photos.addPhoto({ formData });
		})
		.then(body => {
			if (body.status !== 'ok') return Promise.reject({ body, message: 'Что-то пошло не так' })

			return Promise.resolve();
		})
		.then(() => new Promise((resolve, reject) => {
			const unlinksArray = [];

			pathsArray.forEach(path => {
				unlinksArray.push(unlink(path));
			})

			return resolve(Promise.all(unlinksArray));
		})).then(() => Promise.resolve({ status: 'ok' }))
		.catch(error => {
			console.log(error);
			return { status: 'bad', error, message: error.message };
		})
}

exports['add_necrologue'] = (req, res, next) => {
	return searchDeadsLib.getDeadInfo(req.body.id).then(body => {
		body = JSON.parse(body);

		return Promise.resolve(body.data.grave);
	}).then(data => {

		data.value = req.body.value;
		data.clientName = req.session.user.clientName;
		data.userId = req.session.user.id;
		data.target = 'necrologues';

		const graveInfo = parseDeadData(data);

		return memoryBookApi.memory.add(graveInfo);
	}).then(() => {
		return { status: 'ok' }
	}).catch(error => {
		console.log('ОШИБКА');
		console.trace(error);
		return { error, message: error.toString() };
	})
};

exports['add_biography'] = (req, res, next) => {
	return searchDeadsLib.getDeadInfo(req.body.id).then(body => {
		body = JSON.parse(body);

		return Promise.resolve(body.data.grave);
	}).then(data => {

		data.value = req.body.value;
		data.clientName = req.session.user.clientName;
		data.userId = req.session.user.id;
		data.target = 'biographies';

		let graveInfo = parseDeadData(data);

		return memoryBookApi.memory.add(graveInfo);
	}).then(() => {
		return { status: 'ok' }
	}).catch(error => {
		console.log('ОШИБКА');
		console.trace(error);
		return { error, message: error.toString() };
	})
};

exports['search'] = (req, res, next) => {
	return new Promise((resolve, reject) => {

		const encodedUrl = encodeURI(`${memoryBookApi.memoryBookUrl}method/deads.search?q=${req.body.fullname}&part=${req.body.part}`);

		request.get(encodedUrl, (error, response, body) => {
			if (error) {
				return reject(error);
			}

			body = JSON.parse(body);

			data.deads = body.body;
			data.countDeads = body.countDeads.count;
			data.part = req.body.part;
			return resolve(data)
		})
	}).then((data) => {
		return EJS.renderTpl('./views/components/memory_book/items-list.ejs', data);
	}).then(content => {
		data.content = content;
		return data;
	}).catch(error => {
		console.log(error);
		return { status: 'bad', message: error.message };
	})
}

exports['loadMore'] = async (req, res, next) => {
	var data = {};

	var { deads, countDeads } = await memoryBookApi.get(`deads2?part=${req.body.part}`);
	data.deads = deads;
	data.countDeads = countDeads;
	data.part = req.body.part;

	return View.render('components/memory-book', 'items-list.ejs', data).then(content => {
		data.content = content;
		return { status: 'ok', data };
	}).catch(error => {
		console.log(error);
		return { status: 'bad', message: error.message };
	})
}

exports['update'] = (req, res, next) => {
	return memoryBookApi.memory.upd(req.body.table, req.body)
		.then(result => {
			if (result.status !== 'ok') {
				return Promise.reject({ status: 'bad', message: result.message });
			}

			return { status: 'ok', data: result };
		})
		.then(() => memoryBookApi.memory.upd(req.body.table, { target: 'state', value: '2', id: req.body.id, table: req.body.table }))
		.then(result => {
			if (result.status !== 'ok') {
				return Promise.reject({ status: 'bad', message: result.message });
			}

			return { status: 'ok', data: result };
		}).catch(error => {
			console.log(error);
			return { status: 'bad', message: error.message };
		})
};

exports['change-state-item'] = (req, res, next) => {
	req.body.reason = req.body.reason || false;

	return memoryBookApi.memory.upd(req.body.table, req.body).then(result => {
		if (result.status == 'ok') {
			return { status: 'ok', data: result };
		}

		return { status: 'bad', message: result.message };
	}).catch(error => {
		console.log(error);
		return { status: 'bad', message: error.message };
	})
}

exports['delete-item'] = (req, res, next) => {

	if ((req.body.creator != req.session.user.id) && !!req.session.user.adminMode === false) return { status: 'bad', message: 'Нет прав для удаления' };

	return memoryBookApi.memory.del({ target: req.body.target, id: req.body.id }).then(result => {
		return { status: 'ok', data: result }
	}).catch(error => {
		console.log(error.message);
		return { status: 'bad', message: error.message, error }
	})
}

exports['alphavite-search'] = (req, res, next) => {
	new Promise((resolve, reject) => {

		const encodedUrl = encodeURI(`${memoryBookApi.memoryBookUrl}deads.letter?value=${req.body.value}&part=${req.body.part}`);

		request.get(encodedUrl, (error, response, body) => {
			if (error) {
				return reject(error);
			}

			body = JSON.parse(body);
			data.deads = body.body;
			data.countDeads = body.countDeads;
			data.part = req.body.part;
			return resolve(data)
		})
	}).then((data) => {
		return View.render('components/memory-book', 'items-list.ejs', data);
	}).then(content => {
		data.content = content;
		return data;
	}).catch(error => {
		console.log(error);
		return { status: 'bad', message: error.message };
	})
}

const parseDeadData = (data) => {
	return {
		cemetery: data.cemetery_id,
		area: data.area,
		areaName: data.area_name,
		place: data.place,
		cemeteryName: data.cemetery_name,
		surname: data.surname,
		firstname: data.firstname,
		patronymic: data.patronymic,
		born_day: data.born_day,
		born_month: data.born_month,
		born_year: data.born_year,
		die_day: data.die_day,
		die_month: data.die_month,
		die_year: data.die_year,
		dead_id: data.id,
		dead_code: '74-3435',
		common_id: '74-3435-' + data.id,
		value: data.value,
		target: data.target,
		author: data.clientName,
		creator: data.userId,
		mainPhoto: data.mainphoto.photo_preview || '',
		photoOrientation: data.mainphoto.orientation
	};
}