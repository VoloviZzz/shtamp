const db = require('../libs/db');

exports.get = (data = {}) => {
	return db.execQuery("SELECT * FROM templates");
}