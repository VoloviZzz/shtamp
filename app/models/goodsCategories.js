const db = require('../libs/db');

exports.add = function (data = {}) {

	const defaultData = {
		title: `Новая категория`,
		level: '0',
		parent_id: ''
	};

	data = Object.assign(defaultData, data);

	if(!!data.parent_id === true && data.parent_id !== 'false') data.parent_id = `, parent_id = '${data.parent_id}'`

	return db.insertQuery(`
		INSERT INTO 
			goods_cats 
		SET 
			created = NOW(),
			title = '${data.title}',
			level = '${data.level}'
			${data.parent_id}
	`);
}

exports.get = (data = {}) => {
	data.parent_id = typeof data.parent_id !== "undefined" ? `AND gc.parent_id = ${data.parent_id}` : ``;
	data.id = typeof data.id !== "undefined" ? `AND gc.id = ${data.id}` : ``;
	data.public = 'public' in data ? `AND gc.public = '${data.public}'` : '';
	data.level = typeof data.level !== "undefined" ? `AND gc.level = ${data.level}` : ``;
	data.orderBy = 'orderBy' in data ? `ORDER BY ${data.orderBy}` : '';

	return db.execQuery(`
		SELECT gc.*,
			ra.alias
		FROM goods_cats gc
			LEFT JOIN routes_aliases ra ON ra.id = gc.alias_id
		WHERE
			gc.id > 0
			${data.parent_id}
			${data.id}
			${data.level}
			${data.public}
		${data.orderBy}
	`);
}

exports.upd = function (data = {}) {
	return db.execQuery(`
		UPDATE goods_cats
		SET ${data.target} = '${data.value}'
		WHERE id = ${data.id}
	`);
}

exports.del = function (data = {}) {
	if (!!data.id === false) return Promise.resolve(['Нет параметра id для удаления категории', null]);
	return db.execQuery(`
		DELETE FROM goods_cats
		WHERE id = ${data.id}
	`);
}