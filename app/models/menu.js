const db = require('../libs/db');

exports.getMenuItems = function ({ group_id = '', id = '', parent_id = '' }) {
	if (!!parent_id === true) parent_id = `AND parent_id = ${parent_id}`;
	if (!!group_id === true) group_id = `AND group_id = ${group_id}`;
	if (!!id === true) id = `AND id = ${id}`;

	return db.execQuery(`
		SELECT * 
		FROM menu_items 
		WHERE id > 0 
			${group_id} 
			${id} 
			${parent_id}
		ORDER BY priority DESC
	`);
}
exports.getMenuGroups = function () {
	return db.execQuery("SELECT * FROM menu_groups");
}

exports.addMenuItem = function ({ title, parent_id = null, href, menu_id }) {
	return db.insertQuery(`INSERT INTO menu_items SET title = '${title}', parent_id = '${parent_id}', href = '${href}', group_id = '${menu_id}'`);
}

exports.deleteMenuItem = function ({ id, ids }) {
	if (id) {
		return db.execQuery(`DELETE FROM menu_items WHERE id = '${id}'`);
	}
	else if (ids) {
		return db.execQuery(`DELETE FROM menu_items WHERE id IN (${ids})`);
	}
	else {
		throw new Error("Не выбрано условие для удаления");
	}
}

exports.addMenuGroup = function ({ title }) {
	return db.insertQuery(`INSERT INTO menu_groups SET title = '${title}'`);
}

exports.updMenuItem = function ({ id, target, value }) {
	return db.execQuery(`UPDATE menu_items SET ${target} = '${value}' WHERE id = ${id}`);
}