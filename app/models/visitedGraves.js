const db = require('../libs/db');

module.exports = {

	arg: {},

	get(arg = this.arg) {

		let id = arg.id ? `` : ``;
		let client_id = arg.client_id ? `AND v.client_id = ${arg.client_id}` : ``;
		let grave_id = arg.grave_id ? `AND v.grave_id = ${arg.grave_id}` : ``;
		let orderBy = arg.orderBy ? `ORDER BY ${arg.orderBy}` : ``;
		let limit = arg.limit ? `LIMIT ${arg.limit}` : ``;

		let q = `
			SELECT v.*
			FROM visited_graves v
			WHERE
				v.id > 0
				${id}
				${client_id}
				${grave_id}
			${orderBy}
			${limit}
		`;

		return db.execQuery(q);
	},

	add(arg = this.arg) {

		let creator = arg.creator ? `creator = ${arg.creator}` : ``;

		let q = `
			INSERT INTO visited_graves
			SET
				client_id = ${arg.client_id},
				grave_id = ${arg.grave_id}
		`;

		return db.insertQuery(q);
	},

	del(arg = this.arg) {

		let q = `
			DELETE FROM visited_graves
			WHERE
				client_id = ${arg.client_id}
				AND grave_id = ${arg.grave_id}
		`;

		return db.execQuery(q);
	},

	upd(arg = this.arg) {

		let q = `
			
		`;

		return db.execQuery(q);
	}
}