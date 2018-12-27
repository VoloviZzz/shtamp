const db = require('../libs/db');

exports.get = function (arg = {}) {

	arg.prop_id = !!arg.prop_id === true ? `AND prop_id = ${arg.prop_id}` : ``;

	const q = `
			SELECT *
			FROM goods_props_values
			WHERE
				id > 0
				${arg.prop_id}
		`;

	return db.execQuery(q);
}

exports.upd = function (arg = {}) {

}

exports.del = function (arg = {}) {

}

exports.add = function (arg = {}) {

	var checkArgs = [arg.title, arg.prop_id].includes(undefined || false || null || '');
	if (checkArgs === true) return Promise.reject({ message: 'Отсутствуют необходимые параметры', args: arg });

	const q = `INSERT INTO goods_props_values SET ?`;

	return db.insertQuery(q, { title: arg.title, prop_id: arg.prop_id });
}
