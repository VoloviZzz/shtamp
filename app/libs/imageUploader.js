const formidable = require('formidable');
const fs = require('fs-extra');
const url = require('url');
const path = require('path');

exports.uploadImage = function (form, options = {}) {

	form.uploadDir = options.uploadDir || req.app.locals.uploadDir;
	form.keepExtensions = true;

	return new Promise((resolve, reject) => {
		form.parse(req, function (err, fields, files) {
			console.log(files);
			let fileParsePath = path.parse(files.upload.path);
			let fileUrl = `/uploads/${fileParsePath.name}${fileParsePath.ext}`;

			return resolve({ status: 'ok', data: { fileUrl } });
		});
	})
}