const db = require('../libs/db');

exports.get = function (arg = {}) {

	arg.id = !!arg.id === true ? `AND gpbv.id = ${arg.id}` : '';
	arg.good_id = !!arg.good_id === true ? `AND gpbv.good_id = ${arg.good_id}` : '';

	const q = `
			SELECT gpbv.*,
				gp.title as prop_title,
				gpv.title as prop_value_title
			FROM goods_props_bind_values gpbv
				LEFT JOIN goods_props gp ON gpbv.prop_id = gp.id
				LEFT JOIN goods_props_values gpv ON gpbv.prop_value_id = gpv.id
			WHERE
				gpbv.id > 0
				${arg.id}
				${arg.good_id}
		`;

	return db.execQuery(q);
}

exports.upd = function (arg = {}) {

}

exports.del = function (arg = {}) {

	if (!!arg.id === false) return Promise.reject({ message: 'Нет параметра id' });

	const q = `
			DELETE FROM goods_props_bind_values
			WHERE
				id = ${arg.id}
		`;
	return db.execQuery(q);
}

exports.add = function (arg = {}) {

	const q = `
			INSERT INTO goods_props_bind_values
			SET
				good_id = ${arg.good_id},
				prop_id = ${arg.prop_id},
				prop_value_id = ${arg.prop_value_id}
		`;

	return db.insertQuery(q);
}
