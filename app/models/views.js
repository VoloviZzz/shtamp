const db = require('../libs/db');

// работа с подключениями
module.exports = {
	
	// изменение подключения
	set : arg => {
		
		return new Promise((resolve, reject) => {
			
			Log.view('Обращение к модели ' + 'views.set'.grey);
		
			Model
				.checkRequired(arg, ['id'])
				.then(() => {
					
					var activated = '',
						closed = '';
						
					if (arg.activated) activated = `activated = CURRENT_TIMESTAMP(),`;
					if (arg.closed) closed = `closed = CURRENT_TIMESTAMP(),`;
					
					var q = `
						UPDATE views
						SET
							${activated}
							${closed}
							updated = CURRENT_TIMESTAMP()
						WHERE id = ${arg.id}
					`;
					
					// Log.data(q);
					
					Model
						.executeQuery(q)
						.then(result => {
							resolve(result);
						})
						.catch(error => {
							reject(error);
						});
					
				});
		
			
			
		});
		
	},
	
	// запрос списка подключений
	get : () => {
		
		return new Promise((resolve, reject) => {
		
			var q = "SELECT * FROM configs WHERE actual = 1 LIMIT 1";
			
			Model
				.executeQuery(q)
				.then(result => {
					resolve(result[0]);
				})
				.catch(error => {
					reject(error);
				});
			
		});
	},

	// добавление просмотра
	add : arg => {

		if(!!arg['visitorId'] === false || !!arg['visitId'] === false) throw new Error(`Отсутствуют аргументы: arg['visitorId']: ${arg['visitorId']}, arg['visitId']: ${arg['visitId']}`);

		const q = `
			INSERT
			INTO views
			SET
				visit_id = ${arg.visitId},
				visitor_id = ${arg.visitorId},
				path = '${arg.path}'
		`;
		return db.insertQuery(q);
	},
}