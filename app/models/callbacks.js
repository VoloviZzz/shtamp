const db = require('../libs/db');

exports.get = (args = {}) => {
	const id = typeof args.id !== 'undefined' ? `AND cb.id = ${args.id}` : '';
	
	return db.execQuery(`
		SELECT cb.*,
			c.name as manager_name
		FROM callbacks cb
			LEFT JOIN clients c ON c.id = cb.manager_id
		WHERE cb.id > 0 ${id}
	`);
}

exports.add = (args = {}) => {
	if(typeof args.clientNumber == 'undefined') return Promise.resolve([new Error('callbacks add: Отсутствует номер телефона')]);
	
	const recipient_id = 'targetId' in args ? `, recipient_id = '${args.targetId}'` : '';

	return db.insertQuery(`INSERT INTO callbacks SET client_number = '${args.clientNumber}' ${recipient_id}`);
}

exports.del = (args = {}) => {
	if (typeof args.id === 'undefined') return Promise.resolve([new Error('callbacks: Отсутствует параметр id')])
	return db.execQuery(`DELETE FROM callbacks WHERE id = ${args.id}`);
}

exports.upd = (args = {}) => {
	const checkAllParams = [typeof args.target, typeof args.value, typeof args.id].includes('undefined');
	if (checkAllParams === true) return Promise.resolve([new Error('callbacks update: отсутствуют необходимые параметры')]);

	return db.execQuery(`UPDATE callbacks SET ${args.target} = '${args.value}' WHERE id = ${args.id}`)
}