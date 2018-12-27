const db = require('../libs/db');

exports.get = function (arg = {}) {
	const q = `
			SELECT *
			FROM goods_props
			WHERE
				id > 0
		`;

	return db.execQuery(q);
}

exports.upd = function (arg = {}) {

}

exports.del = function (arg = {}) {
	if (!!arg.id === false) return Promise.reject({ message: 'Отсутствует параметр id' });

	const q = `
			DELETE FROM goods_props
			WHERE
				id = ${arg.id}
		`

	return db.execQuery(q);
}

exports.add = function (arg = {}) {

	if (!!arg.title === false) return Promise.reject({ message: 'Отсутствует параметр title' });

	const q = `INSERT INTO goods_props SET ?`;

	return db.insertQuery(q, { title: arg.title });
}
