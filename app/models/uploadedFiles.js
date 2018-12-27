const db = require('../libs/db');

exports.add = (args = {}) => {

	const argsWhiteList = ['name', 'original_name', 'path', 'url'];

	const query = `INSERT INTO uploaded_files SET ?`;

	const data = Object.keys(args)
		.filter(key => argsWhiteList.includes(key))
		.reduce((acc, key) => (acc[key] = args[key], acc), {});

	return db.insertQuery(query, data);
}

exports.get = (args = {}) => {
	const query = `SELECT * FROM uploaded_files`;
	return db.execQuery(query);
}