const db = require('../libs/db');

exports.get = (args = {}) => {
	let { id } = args;
	var q = `
		SELECT * FROM offers order by id desc
	`;
	return db.execQuery(q);
}

exports.upd = (args = {}) => {
	if (!!args.target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (typeof args.value === "undefined") return Promise.resolve([new Error('Отсутствует параметр value')]);
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`UPDATE offers SET ${args.target} = '${args.value}' WHERE id = ${args.id}`);
}

exports.add = (args = {}) => {
	return db.insertQuery('INSERT INTO offers SET title = "Новое предложение", img = "/img/components/offers-list/1.jpg", `desc` = "Описание нового предложения"');
}

exports.del = (args = {}) => {
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`DELETE FROM offers WHERE id = ${args.id}`);
}
