const formidable = require('formidable');

/**
 * прослойка запросов. Парсит входящие запросы.
 * Если запрос имеет тип контента "form-data", то парсит его
 */
module.exports = function (req, res, next) {
	const contentTypeIsFormData = req.is('multipart/form-data');

	if (contentTypeIsFormData === false) {
		return next();
	}

	var form = new formidable.IncomingForm();

	form.parse(req, (error, fields, files) => {
		const stringifyObject = JSON.stringify({});
		let data = {};

		try {
			data = JSON.parse(fields.data || stringifyObject);
		}
		catch (e) {
			return res.json({ status: 'bad', message: `Поле 'data' имеет неверный формат. Запрос не был отработан` });
		}

		req.body = { ...req.body, data };
		next();
	});
}