const db = require('../libs/db');

exports.get = (arg = {}) => {

	let id = arg.id ? `AND id = ${arg.id}` : ``;
	let hash = arg.hash ? `AND hash = '${arg.hash}'` : ``;
	let orderBy = arg.orderBy ? `ORDER BY ${arg.orderBy}` : ``;
	let limit = arg.limit ? `LIMIT ${arg.limit}` : ``;

	let q = `
		SELECT *
		FROM confirmed_emails
		WHERE
			id > 0
			${id}
			${hash}
	`;

	return db.execQuery(q);
}

exports.add = (arg = {}) => {

	let creator = arg.creator ? `creator = ${arg.creator}` : ``;

	let q = `
		INSERT INTO confirmed_emails SET
			hash = '${arg.hash}',
			client_id = ${arg.client_id}
	`;

	return db.insertQuery(q);
}

exports.del = (arg = {}) => {

	let q = `
			
		`;

	return db.execQuery(q);
}

exports.upd = (arg = {}) => {

	let q = `
		UPDATE confirmed_emails SET ${arg.target} = '${arg.value}'
		WHERE
			id = ${arg.id}
	`;

	return db.execQuery(q);
}