const UploadPhotos = require('../libs/UploadPhotos');
const path = require('path');

const Model = require('../models');

exports.addProps = async (req, res, next) => {
	try {
		await Model.goodsProps.add(req.body);
		return { status: 'ok' };
	} catch (error) {
		return { message: error.message, error };
	}
}

exports.addProduct = function (req, res, next) {
	const { Model } = req.app;

	return Model.goodsPositions.add({ ...req.body }).then(([error, newProduct]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.delete = (req, res, next) => {
	const { Model } = req.app;
	return Model.goodsPositions.del(req.body).then(([error]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	})
}

exports.upd = function (req, res, next) {
	const Model = req.app.Model;

	if (!!req.body.id === false) return { message: 'Отсутствует параметр id' };

	return Model.goodsPositions.upd(req.body).then(([error, result]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	});
}

exports.changePriceType = function (req, res, next) {
	req.body = JSON.parse(req.body.data);
	const Model = req.app.Model;

	if (!!req.body.id === false) return { message: 'Отсутствует параметр id' };

	return Model.goodsPositions.upd(req.body).then(([error, result]) => {
		if (error) return { message: error.message, error };
		return { status: 'ok' }
	});
}

exports.getParamsValues = async function (req, res, next) {
	const data = req.body;
	const Model = req.app.Model;
	return Model.goodsPropsValues.get({ prop_id: data.prop_id }).then(([error, paramsValues]) => {
		return { status: 'ok', body: { paramsValues } }
	})
}

exports.addPropsBindValue = async function (req, res, next) {
	const data = req.body;
	const Model = req.app.Model;
	const { prop_id, good_id, prop_value_id } = data;
	return Model.goodsPropsBindValues.add({ prop_id, good_id, prop_value_id }).then(([error, result]) => {
		return { status: 'ok' }
	})
}

exports.addPropsValues = async function (req, res, next) {
	try {

		const { prop_id, prop_value } = req.body;
		const Model = req.app.Model;

		var [error, propValueId] = await Model.goodsPropsValues.add({ title: prop_value, prop_id });
		if (error) throw new Error(error);

		// await Model.goodsPropsBindValues.add({});

		return { status: 'ok' }
	} catch (error) {
		console.log(error);
		return { message: error.message, error };
	}
}

exports.deleteParamsBindValues = async function (req, res, next) {
	const data = req.body;
	const Model = req.app.Model;
	return Model.goodsPropsBindValues.del({ id: data.id }).then(([error, result]) => {
		if (error) return { status: 'bad', message: error.message, error }

		return { status: 'ok' };
	})
}

exports.setMainPhoto = function (req, res, next) {
	const Model = req.app.Model;
	const goodId = req.params.goodId;
	const photosPath = path.join(AppRoot, 'public', 'photos');

	return UploadPhotos(req, { pathToFolder: photosPath })
		.then((result) => {
			return Model.photos.add({ path: result.url, name: result.filename });
		})
		.then((result) => {
			return { status: 'ok', data: { photoId: result[1] } };
		})
		.catch(error => {
			console.log(error);
			return { status: 'bad', error, message: error.message }
		})
}

exports.addPhoto = (req, res, next) => {
	const Model = req.app.Model;
	const goodId = req.query.goodId;
	const photosPath = path.join(AppRoot, 'public', 'photos');
	const State = {
		photoId: null
	};

	const errors = [];

	return UploadPhotos(req, { pathToFolder: photosPath })
		.then((result) => {
			const promises = result.map(fileData => {
				return Model.photos.add({ target: 'goodsPosition', target_id: goodId, ...fileData });
			});

			return Promise.all(promises);
		}).then((photos) => {

			let photoId = false;

			photos.forEach(([error, id]) => {
				if (error) return errors.push(error);

				photoId = photoId === false ? id : photoId;
			})

			if (errors.length > 0) return Promise.reject(error);

			State.photoId = photoId;
			return Model.goodsPositions.get({ id: goodId });
		}).then(([error, goodsPos]) => {
			if (error) return Promise.reject(error);
			goodsPos = goodsPos[0];
			if (!!goodsPos.main_photo === false) {
				return Model.goodsPositions.upd({ target: 'main_photo', value: State.photoId, id: goodsPos.id });
			}

			return Promise.resolve([null]);
		}).then(([error]) => {
			if (error) return Promise.reject(error);
			return { status: 'ok' };
		})
		.catch(error => {
			console.log(error);
			return { status: 'bad', error, message: error.message }
		})
}