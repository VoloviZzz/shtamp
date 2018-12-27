const db = require('../libs/db');
var fs = require("fs");


exports.getFS = async (arg = {}) => {
	return fs.readFileSync('app/components/'+ arg.ctrl +'/'+ arg.name +'.js').toString();
}


exports.get = async (arg = {}) => {
	if (arg.id) {
		var id = 'WHERE c.id = '+arg.id;
	}
	return db.execQuery(`
		SELECT c.*,
			fb.title as block_title
		FROM components c
			LEFT JOIN fragments_blocks fb ON fb.id = c.block_id
			${id}
	`);
}

exports.getComponentBlocks = async (data = {}) => {
	return db.execQuery(`SELECT * FROM fragments_blocks`);
}

exports.add = async (args = {}) => {
	if (!!args.title === false) return Promise.resolve([new Error('Отсутствует параметр target')]);
	if (typeof args.component === "undefined") return Promise.resolve([new Error('Отсутствует параметр value')]);
	if (!!args.block_id === false) return Promise.resolve([new Error('Отсутствует параметр id')]);
	return db.execQuery(`INSERT INTO components SET title = '${args.title}', ctrl = '${args.component}', block_id = ${args.block_id}, static = ${args.static}, once = ${args.once}`);
}
