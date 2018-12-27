/**
 * Получает от программы ответ на запрос сопряжения
 */

module.exports = async (req, res, next) => {
	const { id, token } = req.body.data;
	const { db } = req.app.parent;
	
	var [error] = await db.execQuery(`UPDATE connected_crm SET token = '${token}' WHERE crm_id = '${id}'`);

	if (error) {
		console.error(error);
		return res.json({ status: 'bad', message: error.message });
	}

	return res.json({ status: 'ok' });
}