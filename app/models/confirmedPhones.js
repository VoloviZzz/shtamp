const db = require('../libs/db');

exports.get = (data = {}) => {

	let { phone, confirmed, interval } = data;

	phone = !!phone === true ? `AND phone = '${phone}'` : ``;
	confirmed = !!confirmed === true ? `AND confirmed = '${confirmed}'` : ``;
	interval = !!interval === true ? `AND ${interval}` : '';

	const q = `
		SELECT *
		FROM confirmed_phones
		WHERE id > 0
			${phone}
			${confirmed}
			${interval}
	`;

	return db.execQuery(q);
}

exports.add = (data = {}) => {

	let { phone, code, client_id } = data;

	if (!!phone === false) return Promise.resolve([new Error("Отсутствует обязательный параметр: phone")]);
	if (!!code === false) return Promise.resolve([new Error("Отсутствует обязательный параметр: code")]);

	client_id = !!client_id === true ? `, client_id = '${client_id}'` : ``

	const q = `
		INSERT INTO confirmed_phones SET phone = '${phone}', code = '${code}' ${client_id}
	`;

	return db.insertQuery(q);
}

exports.upd = (data = {}) => {

	const { target, value, id } = data;

	if (!!target === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (!!value === false) return Promise.resolve([new Error('Отсутствует параметр value')]);
	if (!!id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);

	const q = `
		UPDATE confirmed_phones SET ${target} = '${value}' WHERE id = ${id}
	`;

	return db.execQuery(q);
}