const db = require('../libs/db');

exports.add = (arg = {}) => {

	const { creator, text, targetType } = arg;

	if (!!creator === false && creator !== 0) return Promise.resolve([new Error('Отсутствует параметр creator')]);
	if (!!text === false) return Promise.resolve([new Error('Отсутствует параметр text')]);
	if (!!targetType === false) return Promise.resolve([new Error('Отсутствует параметр targetType')]);

	const targetId = 'targetId' in arg ? `, target_id = '${arg.targetId}'` : '';

	const q = `
		INSERT INTO reviews
		SET
			client_id = ${creator},
			text = '${text}',
			target_type = '${targetType}'
			${targetId}
	`;

	return db.insertQuery(q);
}

exports.addCategory = (arg = {}) => {
	const { title } = arg;

	if (!!title === false && title == '') return Promise.resolve([new Error('Отсутствует параметр title')]);

	const q = `
		INSERT INTO reviews_target SET title = '${title}'
	`;

	return db.insertQuery(q);
}

exports.get = (arg = {}) => {

	let { id, public, client_id, targetType, targetId, limit } = arg;
	const { or = {} } = arg;

	or.client_id = 'client_id' in or ? `OR client_id = '${or.client_id}'` : '';

	id = !!id === true ? `AND r.id = '${id}'` : ``;
	client_id = !!client_id === true ? `AND r.client_id = '${client_id}'` : ``;
	public = typeof public !== "undefined" ? `AND (r.published = '${public}' ${or.client_id})` : ``;
	targetType = typeof targetType !== 'undefined' ? `AND r.target_type = '${targetType}'` : ``;
	targetId = !!targetId === true ? `AND r.target_id = '${targetId}'` : ``;
	limit = !!limit === true ? `LIMIT ${limit}` : ``;

	var q = `
		SELECT r.*,
			c.name as clientName,
			c.avatar as clientAvatar
		FROM reviews r
			LEFT JOIN clients c ON r.client_id = c.id
		WHERE r.id > 0
			${id}
			${targetType}
			${targetId}
			${public}
		ORDER BY r.created DESC
		${limit}
	`;

	return db.execQuery(q);
}

exports.getCount = function (args = {}) {
	const { or = {} } = args;
	let { targetType, targetId } = args;

	or.client_id = 'client_id' in or ? `OR r.client_id = '${or.client_id}'` : '';

	targetType = typeof targetType !== 'undefined' ? `AND r.target_type = '${targetType}'` : ``;
	targetId = !!targetId === true ? `AND r.target_id = '${targetId}'` : ``;

	return db.execQuery(`
		SELECT COUNT(id) as reviews_count 
		FROM reviews r 
		WHERE (r.published = '1' ${or.client_id}) 
			${targetType} 
			${targetId}`);
}

exports.getTargets = (args = {}) => {
	return db.execQuery(`SELECT * FROM reviews_target`);
}

exports.upd = (arg = {}) => {

	if (!!arg.target === false) return Promise.resolve([new Error('Отсутствует параметр arg.target')]);
	if (!!arg.value === false) return Promise.resolve([new Error('Отсутствует параметр arg.value')]);
	if (!!arg.id === false) return Promise.resolve([new Error('Отсутствует параметр arg.id')]);

	const q = `UPDATE reviews SET ${arg.target} = '${arg.value}' WHERE id = ${arg.id}`;

	return db.execQuery(q);
}

exports.del = (arg = {}) => {

	if (!!arg.id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);

	var q = `
		DELETE FROM reviews
		WHERE id = ${arg.id}
	`;

	return db.execQuery(q);
}