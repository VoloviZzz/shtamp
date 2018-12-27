const sendPost = require('../../functions/send_post');

module.exports = async function addConnection(req, res, next) {

	const { db } = req.app.parent;

	try {
		const { host, port } = req.body;
		const title = 'Новый сайт';
		const pingResult = await sendPost(`${host}:${port}/shop_api/`, { path: `connect-crm`, func: `ping` });

		if (pingResult.status !== 'ok') {
			return res.json({ status: 'bad', message: 'На данный момент сервер недоступен' });
		}

		var [error, connectId] = await db.insertQuery(`INSERT INTO connected_crm SET title = '${title}', host = '${host}', port = '${port}'`);

		if (error) {
			console.log(`Не удалось добавить соединение в базу`);
			console.error(error);
			return res.json({ message: 'Не удалось добавить соединение в базу', error });
		}

		const connectConfig = require('../../config');
		const connectData = { host: connectConfig.host, port: connectConfig.port, title, site_id: connectId };

		const connectResult = await sendPost(`${host}:${port}/shop_api/`, { path: `connect-crm`, func: `connect-crm`, data: JSON.stringify(connectData) });

		if (connectResult.status !== 'ok') {
			return res.json({ status: 'bad', message: 'Что-то пошло не так' });
		}

		const { data: crm_id } = connectResult;

		var [error] = await db.execQuery(`UPDATE connected_crm SET crm_id = '${crm_id}' WHERE id = '${connectId}'`);

		if (error) {
			console.log(`Не удалось обновить номер подключения CRM`);
			console.error(error);
			return res.json({ message: 'Не удалось обновить номер подключения CRM', error });
		}

		console.log('Запрос успешно обработан');
		return res.json({ status: 'ok' });
	} catch (error) {
		console.error(`Произошла ошибка`);
		console.error(error);

		const message = error.code === 'ENOTFOUND'
			? 'Хост не найден'
			: error.message;

		return res.json({ status: 'bad', message });
	}
}