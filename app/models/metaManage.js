const db = require('../libs/db');

exports.add = (data = {}) => {

	const { route_id, description, keywords, title, target_id, target_type, alias_id } = data;

	const q = `INSERT INTO meta_data SET ?`;
	const addData = {
		route_id, description, keywords, title
	};

	if (!!alias_id !== false) {
		addData.alias_id = alias_id;
	} else {
		addData.target_id = target_id;
		addData.target_type = target_type;
	}

	return db.execQuery(q, addData);
}

exports.get = (data = {}) => {

	const alias_id = !!data.alias_id ? `AND alias_id = '${data.alias_id}'` : '';
	const route_id = !!data.route_id ? `AND route_id = '${data.route_id}'` : '';
	const target_id = !!data.target_id ? `AND target_id = '${data.target_id}'` : '';

	const q = `
		SELECT *
		FROM meta_data
		WHERE
			id > 0
			${alias_id}
			${route_id}
			${target_id}
	`;

	return db.execQuery(q);
}

exports.update = (data = {}) => {

	if (data.id === '') {
		console.error(`Нет параметра id`);
		return Promise.resolve(['Нет параметра id']);
	}

	const title = !!data.title || data.title === '' ? `title = '${data.title}'` : ``;
	const description = !!data.description || data.description === '' ? `description = '${data.description}'` : ``;
	const keywords = !!data.keywords || data.keywords === '' ? `keywords = '${data.keywords}'` : ``;


	const setData = [title, description, keywords].filter(param => param !== '').join(',');

	const q = `UPDATE meta_data SET ${setData} WHERE id = ${data.id}`;
	return db.execQuery(q);
}