module.exports = async (req, res, next) => {
	const { Model } = req.app.parent;
	const updateParamsArray = req.body.data;
	const paramsWhiteList = ['price', 'count', 'id', 'description', 'cat_data', 'title', 'cat_id'];

	for (const params of updateParamsArray) {
		const paramsList = Object.keys(params);

		for (const paramName of paramsList) {
			if (paramsWhiteList.includes(paramName) === false) {
				return res.json({ status: 'bad', message: `Недопустимый параметр: ${paramName}` });
			}
		}
	}

	const updatePromises = [];

	updateParamsArray.forEach(params => {
		const updateQuery = Model.goodsPositions.updateByParams(params);
		updatePromises.push(updateQuery);
	});

	var updateResults = await Promise.all(updatePromises);

	updateResults.forEach(([error]) => {
		if (error) {
			console.log('При обновлении полей позиций произошла ошибка. ------->');
			console.log(error);
		}
	});

	return res.json({ status: 'ok' });
}