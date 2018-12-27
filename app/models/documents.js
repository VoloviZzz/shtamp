const db = require('../libs/db');

exports.get = (arg = {}) => {

	let id = arg.id ? `AND d.id = ${arg.id}` : ``;
	let published = typeof arg.published != 'undefined' ? `AND d.published = ${arg.published}` : ``;
	let orderBy = arg.orderBy ? `ORDER BY ${arg.orderBy}` : ``;
	let limit = arg.limit ? `LIMIT ${arg.limit}` : ``;

	let q = `
		SELECT d.*
		FROM documents d
		WHERE
			d.id > 0
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
		INSERT INTO documents
		SET
			created = NOW()
			${creator}
	`;

	return db.insertQuery(q);
}

exports.del = (arg = {}) => {

	let q = `
		DELETE FROM documents
		WHERE
			id = ${arg.id}
	`;

	return db.execQuery(q);
}

exports.upd = (arg = {}) => {

	let q = `
		UPDATE documents
		SET
			${arg.target} = '${arg.value}'
		WHERE
			id = ${arg.id}
	`;

	return db.execQuery(q);
}