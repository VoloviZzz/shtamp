const db = require('../libs/db');


exports.get = (arg = {}) => {

	let id = arg.id ? `AND a.id = ${arg.id}` : ``;

	let q = `
			SELECT a.*
			FROM achievements a
			WHERE a.id > 0
				${id}
		`;

	return db.execQuery(q);
}

exports.add = (arg = {}) => {

	let q = `
			INSERT INTO achievements () VALUES ()
		`;

	return db.insertQuery(q);
}

exports.del = (arg = {}) => {
	let q = `
			DELETE FROM achievements
			WHERE id = ${arg.id}
		`;

	return db.execQuery(q);
}

exports.upd = (arg = {}) => {
	let q = `
			UPDATE achievements
			SET
				${arg.target} = '${arg.value}'
			WHERE
				id = ${arg.id}
		`;

	return db.execQuery(q);
}
