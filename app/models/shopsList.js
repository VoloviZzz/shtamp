const db = require('../libs/db');

exports.get = (args = {}) => {
	let { id } = args;
	
	id = !!id === true ? `AND s.id = ${id}` : '';

	var q = `
		SELECT s.*,
			CONCAT(p.path, '/origin/', p.name) as origin_path,
			CONCAT(p.path, '/prod/', p.name) as prod_path,
			CONCAT(p.path, '/preview/', p.name) as preview_path,
			ra.alias
		FROM shops_list s
			LEFT JOIN photos p ON s.main_photo = p.id
			LEFT JOIN routes_aliases ra ON ra.id = s.alias_id
		WHERE s.id > 0 
			${id}
	`;
	
	// console.log(q);
	
	return db.execQuery(q);
}

exports.upd = (args = {}) => {
	if (!!args.target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (typeof args.value === "undefined") return Promise.resolve([new Error('Отсутствует параметр value')]);
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`UPDATE shops_list SET ${args.target} = '${args.value}' WHERE id = ${args.id}`);
}

exports.add = (args = {}) => {
	return db.insertQuery(`INSERT INTO shops_list SET created = NOW()`);
}

exports.del = (args = {}) => {
	if (!!args.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`DELETE FROM shops_list WHERE id = ${args.id}`);
}