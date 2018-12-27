const db = require('../libs/db');

exports.get = (args = {}) => {

	const public = 'public' in args ? `AND public = '${args.public}'` : '' ;
	const id = 'id' in args ? `AND id = '${args.id}'` : '' ;

	const q = `
		SELECT *
		FROM agents
		WHERE id > 0
			${id}
			${public}
	`;

	return db.execQuery(q);
}