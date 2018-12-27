var fs = require("fs");


exports.getFS = (req, res, next) => {

}
exports.addFS = (req, res, next) => {
	fs.writeFile('app/'+req.body.path+''+req.body.file+'', '');
	return { status: 'ok' }
}

exports.getFile = (req, res, next) => {
	var file = fs.readFileSync('app/'+req.body.dirname).toString();
	return { status: 'ok', value: file }
}

exports.setFS = (req, res, next) => {
	fs.writeFile('app/'+req.body.path, req.body.template);

	return { status: 'ok' }
}


exports.rmFS = (req, res, next) => {
	fs.unlinkSync('app/'+req.body.path);

	return { status: 'ok' }
}
