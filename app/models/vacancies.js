const db = require('../libs/db');

exports.get = (arg = {}) => {

	let id = arg.id ? `AND v.id = ${arg.id}` : ``;
	let published = typeof arg.published != 'undefined' ? `AND v.published = ${arg.published}` : ``;
	let orderBy = arg.orderBy ? `ORDER BY ${arg.orderBy}` : ``;
	let limit = arg.limit ? `LIMIT ${arg.limit}` : ``;

	let q = `
		SELECT v.*
		FROM vacancies v
		WHERE
			v.id > 0
			${id}
			${published}
			${orderBy}
			${limit}
	`;

	return db.execQuery(q);
}

exports.add = (arg = {}) => {

	let creator = arg.creator ? `,creator = ${arg.creator}` : ``;

	let q = `
		INSERT INTO vacancies
		SET
			created = NOW()
			${creator}
	`;

	return db.insertQuery(q);
}

exports.del = (arg = {}) => {

	let q = `
		DELETE FROM vacancies
		WHERE
			id = ${arg.id}
	`;

	return db.execQuery(q);
}

exports.upd = (arg = {}) => {

	let q = `UPDATE vacancies SET ${arg.target} = '${arg.value}' WHERE id = ${arg.id}`;

	return db.execQuery(q);
}