const request = require('request');

module.exports = {
	apiUrl: 'https://retail.mpkpru.ru/api/',
	rootUrl: 'https://retail.mpkpru.ru',

	getFlowers(data) {
		return this.query('get_flowers', data);
	},

	query(funcName, data = {}) {

		if (!!funcName === false) return Promise.reject(new Error('Отсутствует название вызываемой функции'));

		const requestData = {
			'__function__': funcName,
			data: JSON.stringify(data)
		};

		return new Promise((resolve, reject) => {
			request.post(this.apiUrl, { form: requestData }, (error, response, bodyStringify) => {
				if (error) return reject(error);

				try {
					const body = JSON.parse(bodyStringify);
					const data = body.data;

					if(body.status !== true) {
						return reject(body);
					}

					return resolve(data);
				} catch (error) {
					return reject(error);
				}
			})
		})
	}
};