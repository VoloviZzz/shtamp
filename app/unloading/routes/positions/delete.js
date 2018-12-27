module.exports = async (req, res, next) => {
	const { id } = req.body.data;
	const { Model } = req.app.parent;

	if (!!id === false) {
		return res.json({ message: 'Отсутствует номер позиции' });
	}

	var [error, goodsInOrders] = await Model.ordersGoods.get({ good_id: id });

	if (error) {
		console.log('Ошибка при получении позиций');
		console.error(error);
	}

	if (goodsInOrders.length > 0) {
		var [error] = await Model.goodsPositions.upd({ id, target: 'recycled', value: '1' });
	}
	else {
		var [error] = await Model.goodsPositions.del({ id });

		if (error) {
			console.error(error);
		}

		var [error] = await Model.photos.delete({ target: 'goodsPosition', target_id: id });

		if (error) {
			console.error(error);
		}
	}

	return res.json({ status: 'ok' });
}