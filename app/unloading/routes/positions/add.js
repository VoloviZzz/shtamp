module.exports = async (req, res, next) => {

	const { Model } = req.app.parent;

	console.time(`addPosition`);

	try {

		const positions = req.body.data;
		const returnArray = [];
		const errorsArray = [];

		for (const position of positions) {
			const { name: title, cat_data: cat_id, description, pos_id, mod_id, count, price, site_id: connect_id, service } = position;

			var [error, recycledGoods] = await Model.goodsPositions.get({ connect_id, pos_id, mod_id, recycled: '1' });
			var isRecycled = recycledGoods.length > 0;

			if (isRecycled === true) {
				const { id } = recycledGoods[0];
				const [error] = await Model.goodsPositions.updateByParams({ title, cat_id, description, count, price, service, id, recycled: '0' });

				if (error) {
					console.error('Ошибка при обновлении позиции во время повторной выгрузки товара');
					console.error(error);
					errorsArray.push(error);
				} else {
					returnArray.push({ id, pos_id, mod_id });
				}
			} else {
				const [error, id] = await Model.goodsPositions.add({ title, cat_id, description, count, price, pos_id, mod_id, connect_id, service });

				if (error) {
					console.error('Ошибка при добавлении позиции');
					console.error(error);
					errorsArray.push(error);
				} else {
					returnArray.push({ id, pos_id, mod_id });
				}
			}
		}

		if (errorsArray.length == 0) {
			console.log(`Запрос успешно завершён`);
			console.timeEnd(`addPosition`);
			return res.json({ status: 'ok', data: returnArray });
		} else {
			return res.json({ status: 'bad', errorsArray });
		}
	} catch (error) {
		console.error(`Произошла ошибка`);
		console.error(error);
		return res.json({ status: 'bad', ...error, error });
	}
}