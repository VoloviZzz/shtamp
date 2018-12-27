const formidable = require('formidable');
const path = require('path');
const Model = require('../models');

exports.addCategories = async function (req, res, next) {
	return Model.goodsCategories.add(req.body).then(([error, insertId]) => {
		if (error) return { message: error.message, error }
		return { status: 'ok' };
	});
}

exports.updCategories = async function (req, res, next) {
	return Model.goodsCategories.upd(req.body).then(([error, insertId]) => {
		if (error) return { status: 'bad', error, message: error.message }
		return { status: 'ok' };
	});
}

exports.delCategories = async function (req, res, next) {
	return Model.goodsCategories.del(req.body).then(([error, insertId]) => {
		if (error) return { status: 'bad', error, message: error.message }
		return { status: 'ok' };
	});
}
exports.setImage = async function (req, res, next) {
	const form = new formidable.IncomingForm();

	form.uploadDir = req.app.locals.uploadDir;
	form.keepExtensions = true;

	return new Promise((resolve, reject) => {
		form.parse(req, function (err, fields, files) {
			if (err) return { message: error.message, error }
			let fileParsePath = path.parse(files.upload.path);
			let fileUrl = `/uploads/${fileParsePath.name}${fileParsePath.ext}`;

			return resolve({ status: 'ok', data: { fileUrl } });
		});
	})
}