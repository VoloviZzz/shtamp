const formidable = require('formidable');
const fs = require('fs-extra');
const url = require('url');
const path = require('path');
const uploadPhotos = require('../libs/UploadPhotos');

exports.uploadCKeditor = function (req, res, next) {

	const getQuery = req.query;
	const form = new formidable.IncomingForm();

	form.uploadDir = req.app.locals.uploadDir;
	form.keepExtensions = true;

	const funcNum = getQuery.CKEditorFuncNum;
	const message = 'Файл загружен на сервер';

	return new Promise((resolve, reject) => {
		form.parse(req, function (err, fields, files) {
			let fileParsePath = path.parse(files.upload.path);
			let fileUrl = `/uploads/${fileParsePath.name}${fileParsePath.ext}`;

			return resolve({ status: 'ok', sendData: `<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction(${funcNum}, '${fileUrl}', '${message}');</script>` });
		});
	})
}
exports.uploadPanoram = (req, res, next) => {
	const getQuery = req.query;
	const form = new formidable.IncomingForm();

	form.uploadDir = req.app.locals.uploadDirPanorams;
	form.keepExtensions = true;

	return new Promise((resolve, reject) => {

		form.parse(req, function (err, fields, files) {

			let fileParsePath = path.parse(files.upload.path);
			let fileUrl = `/uploads/panorams/${fileParsePath.name}${fileParsePath.ext}`;

			return resolve({ status: 'ok', message: 'test', data: { fileUrl } });
		});
	})
}
exports.upload = (req, res, next) => {
	const getQuery = req.query;
	const form = new formidable.IncomingForm();

	form.uploadDir = req.app.locals.uploadDir;
	form.keepExtensions = true;

	return new Promise((resolve, reject) => {

		form.parse(req, function (err, fields, files) {

			let fileParsePath = path.parse(files.upload.path);
			let fileUrl = `/uploads/${fileParsePath.name}${fileParsePath.ext}`;

			return resolve({ status: 'ok', message: 'test', data: { fileUrl } });
		});
	})
}

exports.multipleUpload = function (req, res, next) {
	return uploadPhotos(req, {}).then(async (result) => {
		const promises = [];

		result.forEach(photo => {
			const addPhoto = req.app.Model.photos.add({ ...req.query, ...photo });
			promises.push(addPhoto);
		})

		const resultAddPhoto = await Promise.all(promises);

		return { status: 'ok', resultAddPhoto };
	}).catch(error => {
		return { status: 'bad', message: error.message, error };
	})
}
