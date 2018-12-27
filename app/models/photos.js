const db = require('../libs/db');

exports.get = function (data = { id: '' }) {

	let { id, target, target_id } = data;

	id = !!id === true ? `AND id = ${id}` : '';
	target = !!target === true ? `AND target = '${target}'` : '';
	target_id = !!target_id === true ? `AND target_id = '${target_id}'` : '';

	return db.execQuery(`SELECT * FROM photos WHERE id > 0 ${id} ${target} ${target_id}`);
}

exports.add = function (data = { path: '', name: '' }) {

	let { target, target_id } = data;

	if (!!data.path === false) return Promise.resolve([new Error('Отсутствует путь до файла'), null]);
	if (!!data.name === false) return Promise.resolve([new Error('Отсутствует название файла'), null]);

	target = !!target === true ? `, target = '${target}'` : '';
	target_id = !!target_id === true ? `, target_id = '${target_id}'` : '';

	const connect_id = !!data.connect_id === true ? `, connect_id = '${data.connect_id}'` : '';
	const crm_photo_id = !!data.crm_photo_id === true ? `, crm_photo_id = '${data.crm_photo_id}'` : '';

	return db.insertQuery(`INSERT INTO photos SET path = '${data.path}', name = '${data.name}' ${target} ${target_id} ${connect_id} ${crm_photo_id}`);
}

exports.delete = function (data = {}) {

	let { id, target_id, target } = data;
	let whereData = '';

	if (id) {
		whereData = `id = '${id}'`;
	}
	if (target && target_id) {
		whereData = `target_id = '${target_id}' AND target = '${target}'`;
	}

	if (!!whereData === false || whereData === '') return Promise.resolve([new Error('Отсутствует whereData'), null]);

	return db.execQuery(`DELETE FROM photos WHERE ${whereData}`);
}