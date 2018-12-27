const request = require('request')

module.exports = {
	url: app.siteConfig.get('searchDeadsUrl'),
	apiKey: app.siteConfig.get('searchDeadsApiKey'),
	apiLocCode: app.siteConfig.get('searchDeadsApiLocCode'),

	get url() {
		return app.siteConfig.get('searchDeadsUrl');
	},
	
	get apiKey() {
		return app.siteConfig.get('searchDeadsApiKey');
	},
	
	get apiLocCode() {
		return app.siteConfig.get('searchDeadsApiLocCode');
	},

	search(queryParams = {}, ctrl) {

		queryParams.__function__ = ctrl;
		queryParams.key = this.apiKey;

		return new Promise((resolve, reject) => {
			request.post(this.url, { form: queryParams }, (error, response, body) => {
				if (error) {
					return reject(error);
				}

				try {
					body = JSON.parse(body);

					if (body.status != 'ok') {
						return reject({ message: 'Произошла ошибка. ' + body.error });
					}
				}
				catch (e) {
					console.log('ERROR');
					return reject({ message: 'Произошла ошибка. ' + e.message, e });
				}

				return resolve(body.data);
			})
		})
	},

	getDeadInfo(id) {
		return new Promise((resolve, reject) => {
			const requestParams = {
				__function__: 'getDead',
				key: this.apiKey,
				id: id,
			};

			request.post(this.url, { form: requestParams }, (error, response, body) => {
				if (error) {
					return reject(error);
				}

				if (body.status == false || body.status == 'bad') {
					return reject({ status: 'bad' });
				}

				return resolve(body);
			})
		})
	},

	getPlace(id) {
		return new Promise((resolve, reject) => {

			const requestData = {
				method: 'POST', url: this.url, form: {
					__function__: 'getPlace',
					key: this.apiKey,
					id: id,
				}
			};

			request.post(requestData.url, { form: requestData.form }, (error, response, body) => {

				if (error) {
					console.log(error);
					return reject(error)
				}

				try {
					body = JSON.parse(body);

					if (body.status == false) {

						let err = new Error("Страница участка не найдена");
						err.status = 404;

						return reject(err);
					}

					if (body.status == 'bad') {
						let err = new Error("Ошибка сервера");
						err.status = 500;

						return reject(err);
					}

					return resolve(body.data);
				}
				catch (e) {
					console.log('ОШИБКА: ');
					console.error(e);
					reject(e);
				}
			})
		})
	}
}