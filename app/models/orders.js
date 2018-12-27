const db = require('../libs/db');

exports.add = function (data = {}) {
	let { surname, firstname, patronymic, mail, hash, phone, deliveryMethod, paymentMethod, client_id, price } = data;

	patronymic = typeof patronymic !== "undefined" ? patronymic = `, patronymic = '${patronymic}'` : '';
	client_id = !!client_id !== false ? client_id = `, client_id = '${client_id}'` : '';
	hash = !!hash !== false ? hash = `, hash = '${hash}'` : '';
	mail = typeof mail !== "undefined" ? mail = `, email = '${mail}'` : '';
	price = typeof price !== "undefined" ? price = `, price = '${price}'` : '';

	return db.insertQuery(`
		INSERT INTO orders SET 
			surname = '${surname}', 
			firstname = '${firstname}', 
			phone = '${phone}', 
			deliveryMethod = '${deliveryMethod}', 
			paymentMethod = '${paymentMethod}'
			${mail}
			${patronymic}
			${client_id}
			${hash}
			${price}
	`);
}

exports.get = (data = {}) => {

	let { id, hash, client_id, phone, status } = data;

	id = typeof id !== "undefined" ? id = `, o.id = '${id}'` : '';
	hash = typeof hash !== "undefined" ? hash = `AND o.hash = '${hash}'` : '';
	client_id = typeof client_id !== "undefined" ? client_id = `AND o.client_id = '${client_id}'` : '';
	phone = typeof phone !== "undefined" ? phone = `AND o.phone = '${phone}'` : '';
	status = typeof status !== "undefined" ? status = `AND o.status = '${status}'` : '';

	return db.execQuery(`
		SELECT o.*,
			COUNT(og.id) as goods_count
		FROM orders o
			LEFT JOIN orders_goods og ON og.order_id = o.id
		WHERE o.id > 0
			${id}
			${hash}
			${client_id}
			${phone}
			${status}
		GROUP BY o.id
	`)
}

exports.upd = (args = {}) => {

	const { target, value, id, hash } = args;
	let whereData = '';

	if(!!id === true) {
		whereData = `id = ${id}`;
	}
	else if(!!hash === true) {
		whereData = `hash = '${hash}'`;
	}
	else {
		return Promise.reject([new Error('Отсутствует условие')]);
	}

	return db.execQuery(`
		UPDATE orders SET ${target} = '${value}' WHERE ${whereData}
	`)
};