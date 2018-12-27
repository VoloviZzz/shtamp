const db = require('../libs/db');

module.exports = {
	add_entrusting(arg = {}) {

		if (!!arg['client'] === false) return Promise.resolve([new Error('Не указан идентификатор клиента'), null]);
		if (!!arg['mods'] === false) return Promise.resolve([new Error('Не указан идентификатор товара'), null]);
		if (!!arg['pers'] === false) return Promise.resolve([new Error('Не указан идентификатор захоронения'), null]);

		if (arg['count']) arg.count = `, count = ${arg.count}`;

		return db.insertQuery(`
			INSERT INTO flowerassign SET client = ${arg.client}, mods = ${arg.mods}, pers = ${arg.pers} ${arg.count} 
		`);
	},

	get_entrusting(arg = {}) {

		arg.client = !!arg.client ? `AND i.client = ${arg.client}` : '';
		
		arg.invoice = !!arg['invoice'] === true ? `AND i.id = ${arg.invoice}` : '';
		arg.pers = !!arg['pers'] === true ? `AND fa.pers = ${arg.pers}` : '';
		arg.id = !!arg['id'] === true ? `AND fa.id = ${arg.id}` : '';

		return db.execQuery(`
			SELECT
				fa.*,
			i.status as istat, i.amount, i.createtime as idate
			FROM
				flowerassign fa, invoices i
			WHERE
				i.id = fa.invoice
				${arg.id}
				${arg.client}
				${arg.invoice}
				${arg.pers}
			ORDER BY fa.time DESC
		`);
	},

	set_entrusting(arg = {}) {

		if (!!arg['id'] === false) return Promise.resolve(['Отсутствует идентификатор заказа', null]);
		if (!!arg['invoice'] === false) return Promise.resolve(['Отсутствует идентификатор оплаты', null]);

		return db.execQuery(`
			UPDATE flowerassign SET invoice = ${arg.invoice} WHERE id = ${arg.id}
		`);
	},

	del_entrusting(arg = {}) {

		if (!!arg['id'] === false) return Promise.resolve(['Не указан идентификатор позиции', null]);

		return db.execQuery(`
			DELETE FROM flowerassign WHERE id = ${arg.id}
		`);
	}
};