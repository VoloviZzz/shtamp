var mysql = require('mysql');

let state = {
	pool: null,
	mode: null,
}

const config = require('../../config');

exports.connect = () => new Promise((resolve, reject) => {

	// state.pool = mysql.createPool(config.db)
	// state.connection = mysql.createConnection(config.db);
	var connection = mysql.createConnection(config.db);

	connection.connect(error => {
		if (error) {
			return reject(error)
		};

		state.connection = connection;
		return resolve();
	})
})


exports.get = () => state.connection;


exports.execQuery = (queryStr, data = false) => new Promise((resolve, reject) => {

	queryStr = queryStr.replace(/\'NULL\'/ig, 'NULL');

	var queryParams = [queryStr];
	if (data !== false) queryParams.push(data);
	queryParams.push(queryCallback);

	exports.get().query(...queryParams);

	function queryCallback(err, rows) {
		if (err) {
			console.error('----> Произошла ОШИБКА во время выполнения запроса:', err.message);
			console.error('SQL запрос:', queryStr);
			return resolve([err, null, queryStr]);
		}

		return resolve([err, rows, queryStr]);
	};
})


exports.insertQuery = (queryStr, data = false) => new Promise((resolve, reject) => {
	queryStr = queryStr.replace(/\'NULL\'/ig, 'NULL');

	var queryParams = [queryStr];
	if (data !== false) queryParams.push(data);
	queryParams.push(queryCallback);

	exports.get().query(...queryParams);

	function queryCallback(err, rows) {
		if (err) {
			console.log('----> Произошла ОШИБКА во время выполнения запроса:', err.message);
			console.error('SQL запрос:', queryStr);
			return resolve([err, null, queryStr]);
		}

		return resolve([err, rows.insertId]);
	};
})