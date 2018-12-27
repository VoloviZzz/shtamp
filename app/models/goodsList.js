const db = require('../libs/db');

module.exports = {
	async search({ value }) {
		try {
			
			value = value.replace(/['"]/g, '');

			const posesQuery = db.execQuery(`SELECT * FROM goods_pos WHERE title LIKE '%${value}%'`);
			const catsQuery = db.execQuery(`SELECT * FROM goods_cats WHERE title LIKE '%${value}%'`);

			var [[posError, poses], [catsError, cats]] = await Promise.all([posesQuery, catsQuery]);
			if (posError || catsError) throw new Error(`/models/goodsList: Что-то пошло не так`);

			return Promise.resolve({ poses, cats });
		} catch (error) {
			console.log(error);
			return Promise.resolve([error, null]);
		}
	}
};