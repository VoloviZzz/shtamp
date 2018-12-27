const db = require('../libs/db');

exports.del_invoices = function del_invoices(arg = {}) {

	if (!arg['id']) return Promise.resolve([new Error('Не указан идентификатор позиции')]);

	return db.execQuery(`DELETE FROM invoices WHERE id = ${arg.id}`);
}

exports.add_invoices = function add_invoices(arg = {}) {

	if (!arg['client']) return Promise.resolve(['Отсутствует идентификатор клиента', null]);
	if (!arg['amount']) return Promise.resolve(['Сумма не может быть ' + arg['amount'], null]);
	if (!arg['targtype']) return Promise.resolve(['Отсутствует тип оплаты', null]);
	if (!arg['targid']) return Promise.resolve(['Отсутствует идентификатор заказа', null]);
	if (!arg['status']) return Promise.resolve(['Не назначен статус', null]);

	return db.insertQuery(`
		INSERT INTO invoices SET 
			client = ${arg.client},
			amount = ${arg.amount},
			targtype = '${arg.targtype}',
			targid = ${arg.targid},
			status = '${arg.status}'
	`);
}

exports.get_invoices = function get_invoices(arg = {}) {

	arg.client = !!arg['client'] === true ? `AND client =${arg.client}` : '';
	arg.targtype = !!arg['targtype'] === true ? `AND targtype = '${arg.targtype}'` : '';
	arg.id = !!arg['id'] === true ? `AND id = ${arg.id}` : '';

	return db.execQuery(`
		SELECT *
		FROM invoices
		WHERE
			id > 0
			${arg.client}
			${arg.targtype}
			${arg.id}
	`);
}