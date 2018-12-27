const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const Model = require('../models');

const storage = multer.diskStorage({
	destination: './app/public/uploads',
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) return cb(err)

			cb(null, raw.toString('hex') + path.extname(file.originalname))
		})
	}
});

const upload = multer({ storage }).single('file');

const uploadFile = (req, res) => new Promise((resolve, reject) => {
	upload(req, res, error => {
		if (error) {
			return reject(error);
		}

		return resolve();
	})
})

exports.upload = async (req, res) => {
	try {

		await uploadFile(req, res);

		const { originalname: original_name, filename: name, path } = req.file;
		const url = `/uploads/${name}`;

		const [error] = await Model.uploadedFiles.add({ original_name, name, path, url });
		if(error) throw new Error(error);

		return { status: 'ok' };
	} catch (error) {
		console.error(error);
		
		return { message: error.message };
	}
}