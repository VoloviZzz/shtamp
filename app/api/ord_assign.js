const retailApi = require('../retail-api');

exports['ord_assign'] = (req, res, next) => {

	const model = req.app.Model;

	return new Promise((resolve, reject) => {
		retailApi.getFlowers().then(async flowers => {

			var [error, reserv] = await model.flowersAssign.get_reserv_assign({ status: '0' });

			var mods = [], mods_reserv = {}, count_reserv = {}, mods_id = '', goods_mods_pos;

			if (reserv.length > 0) {
				for (let r of reserv) {
					mods.push(r.mods);
					mods_reserv[r.mods] = mods_reserv[r.mods] || 0;

					mods_reserv[r.mods]++;
				}

				if (mods.length > 0) mods_id = mods.join(',');

				var goods_mods_pos = await retailApi.query('get_goods_mods_pos', { 'ids': mods_id });

				if (goods_mods_pos.length > 0) {
					for (let id in goods_mods_pos) {
						let p = goods_mods_pos[id];
						count_reserv[p.good] = count_reserv[p.good] || 0;
						count_reserv[p.good] += mods_reserv[p.id];
					}
				}
			}

			return req.app.ejs.renderFile(path.join(__dirname, '../components/dead-view/flowers-list.ejs'), { flowersUrl: retailApi.rootUrl, flowers, count_reserv }, function (error, content) {
				if (error) {
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