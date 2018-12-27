const db = require('../libs/db');

module.exports = {
	
	arg: {},
	
	get(arg = this.arg) {
		
		let id = arg.id ? `AND r.id = ${arg.id}` : ``;
		let orderBy = arg.orderBy ? `ORDER BY ${arg.orderBy}` : ``;
		let limit = arg.limit ? `LIMIT ${arg.limit}` : ``;
		
		let q = `
			SELECT r.*,
				c.name as client_name,
				c.phone as client_phone
			FROM error_reports r
				LEFT JOIN clients c ON c.id = r.client_id
			WHERE r.id > 0
				${id}
			${orderBy}
			${limit}
		`;

		return db.execQuery(q);
	}, 
	
	add(arg = this.arg) {
		
		let client = typeof arg.client != 'undefined' ? `, client_id = ${arg.client}` : '';

		let q = `
			INSERT INTO error_reports
			SET
				text = '${arg.text}'
				${client}
		`;

		return db.insertQuery(q);
	},
	
	del(arg = this.arg) {

		let id = !!arg.id ? `id = ${arg.id}` : '';
		let ids = !!arg.ids ? `id IN (${arg.ids})` : '';

		if(id == '' && ids == '') {
			return Promise.reject('Отсутствуют идентификаторы записей');
		}

		let q = `
			DELETE FROM error_reports
			WHERE
				${id}
				${ids}
		`;
		
		return db.execQuery(q);
	},
	
	upd(arg = this.arg) {
		
		let id = !!arg.id ? `id = ${arg.id}` : '';
		let ids = !!arg.ids ? `id IN (${arg.ids})` : '';

		if(id == '' && ids == '') {
			return Promise.reject('Отсутствуют идентификаторы записей');
		}

		let q = `
			UPDATE error_reports
			SET
				${arg.target} = '${arg.value}'
			WHERE
				${id}
				${ids}
		`;
		
		return db.execQuery(q);
	}
}