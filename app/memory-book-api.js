const request = require('request');

const errors = {
	falseData: 'Отсутствует параметр data',
	falseFormData: 'Отсутствует параметр formData',
	falseForm: 'Отсутствует параметр form',
}

const doRequest = ({ method, url, data = {} }) => new Promise(function (resolve, reject) {

	if ([api.getUrl(), api.getPhotoPath()].includes('') === true) {
		throw new Error('Отсутствует url получения данных с книги памяти');
	}

	request({ method, url, ...data }, async (error, httpResponse, body) => {
		if (error) reject(error);

		try {
			body = JSON.parse(body);
			resolve(body);
		} catch (error) {
			reject(error);
		}
	});
})

const api = {
	doRequest,
	memoryBookUrl: app.siteConfig.get('memoryBookApiUrl'),
	memoryBookPhotoPath: app.siteConfig.get('memoryBookMediaServer'),

	getUrl() {
		return app.siteConfig.get('memoryBookApiUrl');
	},

	getPhotoPath() {
		return app.siteConfig.get('memoryBookMediaServer');
	},

	photos: {
		addPhoto({ formData }) {
			return api.postFormData('photos.add', formData);
		},

		getPhotos(data = {}) {
			return api.get('photos', data);
		},
	},

	deads: {
		search(data = false) {
			return api.post('deads.search', data);
		}
	},

	memory: {
		del(data = false) {
			if (!!data === false) return Promise.reject(`mb.api.memory.del: ${errors.falseData}`);

			return api.post('memory.del', data);
		},

		add(data = false) {
			if (!!data === false) return Promise.reject(`mb.api.memory.add: ${errors.falseData}`);

			return api.post('memory.add', data);
		},

		upd(target, data = false) {
			if (!!data === false) return Promise.reject(`mb.api.upd.add: ${errors.falseData}`);
			if (!!data.target === false) return Promise.reject(`mb.api.memory.upd: data.target is false`);

			return api.post(target + '.upd', data);
		}
	},

	get(ctrl, data = {}) {
		return this.doRequest({ method: 'get', url: this.getUrl() + ctrl, data: { form: data } });
	},

	post(ctrl, data = {}) {
		return this.doRequest({ method: 'post', url: this.getUrl() + ctrl, data: { form: data } });
	},

	postFormData(ctrl, formData = false) {
		if (!!data === false) return Promise.reject(`mb.api.postFormData: ${errors.falseData}`);
		if (!!data.formData === false) return Promise.reject(`mb.api.postFormData: ${errors.falseFormData}`);

		return this.doRequest({ method: 'post', url: this.getUrl() + ctrl, data: { formData } });
	},
};

module.exports = api;