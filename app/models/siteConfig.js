const db = require('../libs/db');

exports.get = (data = {}) => {

	let { target } = data;

	target = !!target === true ? `AND target = '${target}'` : ``;

	return db.execQuery(`
		SELECT *
		FROM global_site_config
		WHERE id > 0
			${target}
	`);
}

exports.add = (data = {}) => {

	if (!!data.target === false) return Promise.reject(new Error('Отсутствует параметр target'));
	if (!!data.value === false && data.value !== '') return Promise.reject(new Error('Отсутствует параметр value'));

	data.title = !!data.title ? data.title : ``;

	return db.insertQuery(`INSERT INTO global_site_config SET title = '${data.title}', target = '${data.target}', value = '${data.value}'`);
}

exports.upd = (data = {}) => {

	if (!!data.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	if (!!data.target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (!!data.value === false && data.value !== '') return Promise.resolve([new Error('Отсутствует параметр value')]);

	return db.execQuery(`
		UPDATE global_site_config SET ${data.target} = '${data.value}' WHERE id = '${data.id}'
	`);
}

exports.setValue = (data = {}) => {

	if(!!data.value === false && data.value !== '') return Promise.resolve([new Error('Нет параметра value')]);
	if(!!data.target === false) return Promise.resolve([new Error('Нет параметра target')]);

	return db.execQuery(`
		UPDATE global_site_config SET value = '${data.value}' WHERE target = '${data.target}'
	`);
}

exports.del = (data = {}) => {
	if (!!data.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);

	return db.execQuery(`
		DELETE FROM global_site_config WHERE id = '${data.id}'
	`);
}