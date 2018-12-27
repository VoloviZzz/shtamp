const Model = require('../models');
const { uploadImage } = require('../libs/imageUploader');
const formidable = require('formidable');
const path = require('path');

exports.add = async function (req, res, next) {
	const { fragment_id } = req.body;
	let slides = [];
	let lastId = 0;

	return await Model.fragments.getFragmentsData({ fragment_id }).then(([error, rowsData]) => {
		if (rowsData.length > 0) {
			slides = JSON.parse(rowsData[0].data).content.slides;
			lastId = JSON.parse(rowsData[0].data).content.lastId || 0;
		}

		slides.push({ id: ++lastId, img: "", img_bottom: "", title: "", title_bottom: '', description: ``, href: '' });

		return Model.fragments.setData({ fragment_id, data: { slides, lastId } });
	}).then(([error, result]) => {
		return { status: 'ok' }
	});
}

exports.deleteSlide = async function (req, res, next) {
	const { fragment_id, slide_id } = req.body;

	return Model.fragments.getFragmentsData({ fragment_id })
		.then(([error, rowsData]) => {
			if (error) return Promise.reject(error);

			const slides = JSON.parse(rowsData[0].data).content.slides

			slides.some((slide, index) => slide.id == slide_id ? slides.splice(index, 1) : false)

			return Model.fragments.setData({ fragment_id, data: { slides } });
		})
		.then(([error, result]) => {
			if (error) return Promise.reject(error);

			return { status: 'ok' }
		})
		.catch(error => {
			return { status: 'bad', message: error.message }
		});
}

exports.updSlide = async function (req, res, next) {
	const { slide_id, fragment_id, target, value } = req.body;

	return Model.fragments.getFragmentsData({ fragment_id })
		.then(([error, rowsData]) => {
			if (error) return Promise.reject(error);
			const slides = JSON.parse(rowsData[0].data).content.slides

			slides.some((slide, index) => slide.id == slide_id ? slides[index][target] = value : false);

			return Model.fragments.setData({ fragment_id, data: { slides } });
		})
		.then(([error, result]) => {
			if (error) return Promise.reject(error);

			return { status: 'ok' }
		})
		.catch(error => {
			console.log(error);
			return { status: 'bad', message: error.message }
		});
}

exports.setImage = async function (req, res, next) {
	const form = new formidable.IncomingForm();

	form.uploadDir = req.app.locals.uploadDir;
	form.keepExtensions = true;

	return new Promise((resolve, reject) => {
		form.parse(req, function (err, fields, files) {
			let fileParsePath = path.parse(files.upload.path);
			let fileUrl = `/uploads/${fileParsePath.name}${fileParsePath.ext}`;

			return resolve({ status: 'ok', data: { fileUrl } });
		});
	})
}

module.exports.moveSlide = async function (req, res, next) {
	const { slide_id, current_position, move_position, fragment_id } = req.body;

	return Model.fragments.getFragmentsData({ fragment_id })
		.then(([error, rowsData]) => {
			if (error) return Promise.reject(error);
			const slides = JSON.parse(rowsData[0].data).content.slides;

			[slides[current_position], slides[move_position]] = [slides[move_position], slides[current_position]];

			return Model.fragments.setData({ fragment_id, data: { slides } });
		})
		.then(([error, result]) => {
			if (error) return Promise.reject(error);

			return { status: 'ok' }
		})
		.catch(error => {
			console.error(error);
			return { status: 'bad', message: error.message }
		});
}