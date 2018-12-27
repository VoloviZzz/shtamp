const request = require('request');

module.exports = (url, data) => {
	return new Promise((resolve, reject) => {
		request.post(url, { form: data }, (error, response, body) => {
			if (error) {
				console.log(error);
				return reject(error);
			}

			try {
				body = JSON.parse(body);
			} catch (error) {
				console.error(`Не удалось преобразовать тело ответа в JSON или возникла другая ошибка`);
				console.log('error', error);
				console.log('body', body);
				return reject(error);
			}

			return resolve(body);
		});
	})
};