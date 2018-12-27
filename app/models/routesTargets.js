const db = require('../libs/db');

exports.add = (args = {}) => {

	const defaultData = {
		title: 'Новый target',
		used_table: '',
		code: '',
		...args
	};

	const getDataObject = (acc, key) => {
		acc[key] = defaultData[key];
		return acc;
	};

	const whiteListParams = ['title', 'used_table', 'code'];

	const data = whiteListParams
		.filter(key => defaultData[key] || defaultData[key] === '')
		.reduce(getDataObject, {});

	const q = `INSERT INTO routes_targets SET ?`;
	return db.execQuery(q, data);
}

exports.get = (args = {}) => {
	const q = `SELECT * FROM routes_targets`;
	return db.execQuery(q);
}

exports.delete = (args = {}) => {
	if (!!args.id === false) {
		console.error('Отсутствует id для удаления');
		return Promise.resolve([new Error('Отсутствует id для удаления')]);
	}

	const q = `DELETE FROM routes_targets WHERE id = '${args.id}'`;
	return db.execQuery(q);
}

exports.update = (args = {}) => {
	if (!!args.id === false) {
		console.error('Отсутствует id для удаления');
		return Promise.resolve([new Error('Отсутствует id для редактирования')]);
	}

	if (!args.target) {
		console.error('Отсутствует id для удаления');
		return Promise.resolve([new Error('Отсутствует target для редактирования')]);
	}

	if (!args.value && args.value !== '') {
		console.error('Отсутствует id для удаления');
		return Promise.resolve([new Error('Отсутствует value для редактирования')]);
	}

	const q = `UPDATE routes_targets SET ${args.target} = '${args.value}' WHERE id = '${args.id}'`;
	return db.execQuery(q);
}