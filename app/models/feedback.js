const db = require('../libs/db');

exports.add = (args = {}) => {
	let { client_name, client_from, client_phone, client_email, message, client_id, category, url } = args;

	client_id = client_id ? `'${client_id}'` : `NULL`;
	client_from = client_from ? `'${client_from}'` : `''`;

	return db.insertQuery(`INSERT INTO feedback (client_id, client_name, client_from, client_phone, client_email, message, category, url) 
		VALUES (${client_id}, '${client_name}', ${client_from}, '${client_phone}', '${client_email}', '${message}', '${category}', '${url}')`);
}

exports.get = (args = {}) => {

	let client_id = args.client_id ? `AND client_id = '${args.client_id}'` : '';

	return db.execQuery(`
		SELECT * 
		FROM feedback
			WHERE id > 0
			${client_id}
		ORDER BY id DESC
	`);
}