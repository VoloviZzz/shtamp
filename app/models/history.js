const db = require('../libs/db');

exports.get = (args = {}) => {
	let { id } = args;
	var q = `
		SELECT * FROM history
	`;
	return db.execQuery(q);
}

exports.upd = (args = {}) => {
	if (!!args.target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (typeof args.value === "undefined") return Promise.resolve([new Error('Отсутствует параметр value')]);
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`UPDATE history SET ${args.target} = '${args.value}' WHERE id = ${args.id}`);
}

exports.add = (args = {}) => {
	return db.insertQuery('INSERT INTO history SET title = "Новое событие", img = "/uploads/upload_3567a312aec44256a029443bfcb4e69f.gif", `desc` = "Описание нового события"');
}

exports.del = (args = {}) => {
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`DELETE FROM history WHERE id = ${args.id}`);
}
