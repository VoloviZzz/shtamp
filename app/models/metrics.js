const db = require('../libs/db');

exports.add = (args = {}) => {
	const q = `INSERT INTO metrics SET ?`;

	const defaultValues = {
		title: 'Новый счётчик'
	};

	const fields = {
		...args,
		...defaultValues
	};

	return db.insertQuery(q, fields);
};

exports.get = (args = {}) => {
	const q = `SELECT * FROM metrics`;

	return db.execQuery(q);
};

exports.update = (args = {}) => {

	if (!args.id) throw new Error('UPDATE: id is missing');

	const fieldsWhiteList = ['code', 'title'];

	const { id, ...argsNoId } = args;
	const q = `UPDATE metrics SET ? WHERE id = ${id}`;

	const fields = Object.keys(argsNoId)
		.filter(key => fieldsWhiteList.includes(key))
		.reduce((acc, key) => (acc[key] = argsNoId[key], acc), {})

	return db.execQuery(q, fields);
};

exports.delete = (args = {}) => {

	if (!args.id) throw new Error('DELETE: id is missing');

	const q = `DELETE FROM metrics WHERE id = ${args.id}`;

	return db.execQuery(q);
};