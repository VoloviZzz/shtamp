module.exports = async (req, res, next) => {
	const { Model } = req.app.parent;
	const { ids } = req.body.data;

	if (ids === '' || !!ids === false || typeof ids !== 'string') {
		return res.json({ message: 'ids имеет неправильный формат' });
	}

	var [error, positions] = await Model.goodsPositions.get({ ids });
	var resultArray = [];

	for (const position of positions) {
		const { id: positionId } = position;
		const [error, photos] = await Model.photos.get({ target: 'goodsPosition', target_id: positionId });

		const photosIds = photos.reduce((prev, item) => {
			prev.push(item.crm_photo_id);
			return prev;
		}, []);

		position.photos = photos;
		position.photosIds = photosIds;
		resultArray.push(position);
	}

	if (error) {
		return res.json({ status: 'bad', message: 'Что-то пошло не так', error });
	}

	return res.json({ status: 'ok', data: resultArray });
}