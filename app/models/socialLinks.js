const db = require('../libs/db');

exports.get = (data = {}) => {
	return db.execQuery(`SELECT * FROM social_links`);
}

exports.add = (data = {}) => {
	return db.insertQuery(`INSERT INTO social_links SET created = NOW()`);
}

exports.upd = (data = {}) => {
	if(!!data.target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if(!!data.value === false) return Promise.resolve([new Error('Отсутствует параметр value')]);
	if(!!data.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`UPDATE social_links SET ${data.target} = '${data.value}' WHERE id = ${data.id}`);
}

exports.del = (data = {}) => {
	if(!!data.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`DELETE FROM social_links WHERE id = ${data.id}`);
}