const db = require('../libs/db');

exports.get = (args = {}) => {
	const id = typeof args.id !== 'undefined' ? `AND id = ${args.id}` : '';
	return db.execQuery(`SELECT * FROM works WHERE id > 0 ${id}`);
}

exports.add = (args = {}) => {
	return db.insertQuery(`INSERT INTO works SET created = NOW()`);
}

exports.del = (args = {}) => {
	if (typeof args.id === 'undefined') return Promise.resolve([new Error('works: Отсутствует параметр id')])
	return db.execQuery(`DELETE FROM works WHERE id = ${args.id}`);
}

exports.upd = (args = {}) => {
	const checkAllParams = [typeof args.target, typeof args.value, typeof args.id].includes('undefined');
	if (checkAllParams === true) return Promise.resolve([new Error('works update: отсутствуют необходимые параметры')]);

	return db.execQuery(`UPDATE works SET ${args.target} = '${args.value}' WHERE id = ${args.id}`)
}