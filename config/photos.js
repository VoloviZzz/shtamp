const path = require('path');

module.exports = {
	previewSize : {
		width : 600,
		height : 400,
	},
	prodSize : {
		width : 800,
		height : 600,
	},
	pathTOImages: path.join(__dirname, '..', 'app', 'public', 'photos', 'goods'),
	fullPathToImages: '',
	// pathToSurveys : '/img/surveys/',
	// fullPathToSurveys : '/mnt/disk1/photos/surveys/',
	// // fullPathToSurveys : 'C:/Node/m1/client/public/img/surveys/',
	maxOriginSize : 5 * 1024 * 1024,
	supportedMimeTypes : [
		'image/jpg',
		'image/jpeg',
		'image/png',
	],
};