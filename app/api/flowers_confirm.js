const api = require('../retail-api');
const searchApi = require('../libs/search-deads');

exports.flowers_confirm = (req, res, next) => {
	return new Promise((resolve, reject) => {
		api.query('get_goods_mod', { 'id': req.body.mod }).then(async flowers => {

			var person_id = req.body.person;
			var querySearch = await searchApi.search({ graveNumber: person_id, search_mode: 'advanced' }, 'searchDead');
			var dead = querySearch.graves[person_id];

			req.app.ejs.renderFile(path.join(__dirname, '../components/dead-view/flowers-confirm.ejs'), { flowersUrl: api.rootUrl, flowers, dead, count: req.body.count }, function (error, content) {
				if (error) {
					console.log(error);
					return resolve({ data: error.message, error });
				}

				return resolve({ status: 'ok', data: content });
			});
		})
	}).then((result) => {
		return result;
	}).catch(error => {
		console.log(error);
		return { error, data: error.message };
	})
}