/**
 * Удаление фото с сайта
 */

module.exports = async (req, res, next) => {
	const photos = req.body.data;
	const errorsArray = [];

	const { db } = req.app.parent;

	for (const photo of photos) {
		const { id, crm_photo_id } = photo;

		var [error] = await db.execQuery(`DELETE FROM photos WHERE target = 'goodsPosition' AND target_id = '${id}' AND crm_photo_id = '${crm_photo_id}'`);

		if (error) {
			console.log('Не удалось удалить фото');
			console.error(error);
			errorsArray.push(error.message);
		}
	}

	return res.json({ status: 'ok', errorsArray });
}