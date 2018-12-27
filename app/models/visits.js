const Helpers = require('../libs/Helpers');
const db = require('../libs/db');

// работа с подключениями
module.exports = {

	// изменение подключения
	set: arg => {
		return new Promise((resolve, reject) => {
			Model.checkRequired(arg, ['id']).then(() => {

				var activated = '',
					closed = '';

				if (arg.activated) activated = `activated = CURRENT_TIMESTAMP(),`;
				if (arg.closed) closed = `closed = CURRENT_TIMESTAMP(),`;

				var q = `
						UPDATE views
						SET
							${activated}
							${closed}
							updated = CURRENT_TIMESTAMP()
						WHERE id = ${arg.id}
					`;

				Model.executeQuery(q).then(result => {
					resolve(result);
				}).catch(error => {
					reject(error);
				});

			});
		});
	},

	// запрос списка подключений
	get(arg = {}) {

		let period = '';
		const today = new Date();
		let defaultBegin = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

		defaultBegin = Helpers.formatDate(defaultBegin, 'yyyy-MM-dd');
		period = `AND created >= '${defaultBegin} 00:00'`;

		if (arg.end && arg.begin) {
			period = `AND created >= '${arg.begin} 00:00' AND created <= '${arg.end} 23:59'`;
		}

		let q = `
			SELECT *
			FROM visits
			WHERE id > 0
				${period}
		`;

		return db.execQuery(q);
	},

	// добавление визита
	add: (arg) => {
		if (!!arg.visitorId === false) throw new Error(`Отсутствует обязательный параметр visitorId: ${arg.visitorId}`);
		return db.insertQuery(`INSERT INTO visits SET visitor_id = ${arg.visitorId}, visitor_ip = '${arg.visitorIp}'`);
	},
}