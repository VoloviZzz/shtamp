const retailApi = require('../retail-api');
const db = require('../libs/db');

exports['flower_mods'] = (req, res, next) => {

	const model = req.app.Model;
	const good = req.body.good;

	return new Promise((resolve, reject) => {

		retailApi.query('get_mods', { good }).then(async (result) => {
			const flowers = result[good];
			
			var mods = [];
			var mods_reserv = {};
			var count_reserv = 0;
			var mods_id = '';
			var goods_mods_pos;

			var [error, reserv_fa] = await model.flowersAssign.get_reserv_assign({ status: '0' });

			if (reserv_fa.length > 0) {

				for (let r of reserv_fa) {
					mods.push(r.mods);
					mods_reserv[r.mods] = mods_reserv[r.mods]++ || 1;
				}

				if (mods.length > 0) mods_id = mods.join(',');

				var goods_mods_pos = await retailApi.query('get_goods_mods_pos', { 'ids': mods_id, 'pos': good });

				if (goods_mods_pos.length > 0) {
					for (let p of goods_mods_pos) {
						count_reserv += mods_reserv[p.id];
					}
				}
			}

			for (var id of Object.keys(flowers['mods'])) {
				var m = flowers['mods'][id];

				var [error, [reserv]] = await db.execQuery(`SELECT COUNT(id) as count_res FROM flowerassign WHERE mods = ${m.id} AND status = 0`);

				flowers['mods'][id]['free_count'] = m['shop9'] - reserv.count_res;
			}

			return req.app.ejs.renderFile(path.join(__dirname, '../components/dead-view/flowers-mods.ejs'), { flowersUrl: retailApi.rootUrl, flowers, count_reserv }, function (error, content) {
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
		return { message: error.message, error };
	})
}