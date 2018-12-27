const db = require("../libs/db");

exports.get = (args = { id: '' }) => {
	args.id = !!args.id === true ? `AND p.id = ${args.id}` : ``;
	args.orderBy = typeof args.orderBy != 'undefined' ? `ORDER BY ${args.orderBy}` : '';
	args.limit = 'limit' in args ? `LIMIT ${args.limit}` : '';
	args.target = 'target' in args ? `AND p.target = '${args.target}'` : ``;
	args.public = 'public' in args ? `AND p.public = '${args.public}'` : ``;
	args.category = 'category' in args && args.category !== '' ? `AND p.cat = '${args.category}'` : ``;

	const q = `
		SELECT p.*,
			ra.alias
		FROM posts p
			LEFT JOIN routes_aliases ra ON ra.id = p.alias_id
		WHERE p.id > 0 
			${args.id} 
			${args.target}
			${args.public}
			${args.category}
			${args.orderBy}
		${args.limit}`;

	return db.execQuery(q);
}

exports.add = (args = {}) => {
	args.creator = args.creator ? `, creator = ${args.creator}` : '';
	args.target = args.target ? `, target = '${args.target}'` : '';
	args.category = args.category ? `, cat = '${args.category}'` : '';
	return db.insertQuery(`INSERT INTO posts SET created = NOW() ${args.creator} ${args.category} ${args.target}`);
}

exports.del = (arg = {}) => {
	if (typeof arg.id == "undefined") return Promise.resolve([new Error('Нет параметра id')]);
	return db.execQuery(`DELETE FROM posts WHERE id = ${arg.id}`);
}

exports.upd = (arg = {}) => {
	if (typeof arg.target == "undefined") return Promise.resolve([new Error('Нет параметра target')]);
	if (typeof arg.value == "undefined") return Promise.resolve([new Error('Нет параметра value')]);
	if (typeof arg.id == "undefined") return Promise.resolve([new Error('Нет параметра id')]);

	return db.execQuery(`UPDATE posts SET ${arg.target} = ? WHERE id = ${arg.id}`, [arg.value]);
}