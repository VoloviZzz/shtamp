const db = require('../libs/db');

module.exports = {
	get_reserv_assign(args = {}) {

		if ('status' in args) args.status = `AND status = ${args.status}`;
		
		return db.execQuery(`
			SELECT *
			FROM flowerassign
			WHERE
				id > 0
				${args.status}
		`);
	}
};