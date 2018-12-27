const request = require(`request`);
const fs = require('fs');

const path = require('path');

const saveImageByUrl = function saveImageByUrl(url, file) {
	return new Promise((resolve, reject) => {
		const stream = request(url).pipe(file);

		stream.on('finish', () => resolve(true));
		stream.on('error', (error) => reject(error));
	})
}

/**
 * todo:
 * изменить путь сохранения файлов;
 * сделать проверку на существование пути сохранения файла
 */

/**
 * получает массив с фото с программы,
 * и загружает их на сервер сайта.
 */
module.exports = async (req, res, next) => {
	const { Model, db } = req.app.parent;
	try {
		const photos = req.body.data;
		const errorsArray = [];

		for (const photo of photos) {

			const { id, crm_photo_id, links, site_id: connect_id } = photo;
			const photoParse = path.parse(links.origin);

			if (!!id === false || !!crm_photo_id === false || !!connect_id === false) {
				errorsArray.push('Ошибка входных параметров для добавления фото');
				continue;
			}

			const photoUrl = `/uploads/unloading/position_${id}`;
			const photoName = `${photoParse.name}${photoParse.ext}`;

			const folderExist = fs.existsSync(`app/public/uploads/unloading/position_${id}`);

			if (folderExist === false) {
				fs.mkdirSync(`app/public/uploads/unloading/position_${id}`);
				fs.mkdirSync(`app/public/uploads/unloading/position_${id}/origin`);
				fs.mkdirSync(`app/public/uploads/unloading/position_${id}/prod`);
				fs.mkdirSync(`app/public/uploads/unloading/position_${id}/preview`);
			}

			var [error, connectedCrm] = await db.execQuery(`SELECT * FROM connected_crm WHERE id = ${connect_id}`);
			const { host, port } = connectedCrm[0];

			const originFile = fs.createWriteStream(`app/public/${photoUrl}/origin/${photoName}`);
			const fullFile = fs.createWriteStream(`app/public/${photoUrl}/prod/${photoName}`);
			const previewFile = fs.createWriteStream(`app/public/${photoUrl}/preview/${photoName}`);

			const originUrl = `http://${host}:${port}${links.origin}`;
			const fullUrl = `http://${host}:${port}${links.full}`;
			const previewUrl = `http://${host}:${port}${links.preview}`;

			await saveImageByUrl(originUrl, originFile);
			await saveImageByUrl(fullUrl, fullFile);
			await saveImageByUrl(previewUrl, previewFile);

			var [error, newPhotoId] = await Model.photos.add({ name: photoName, path: photoUrl, target: 'goodsPosition', target_id: id, connect_id, crm_photo_id });
			await Model.goodsPositions.upd({ target: 'main_photo', value: newPhotoId, id });

			if (error) {
				console.log(`Не удалось сохранить фото в базу`);
				console.error(error);
			}
		}

		return res.json({ status: 'ok' });
	} catch (error) {
		console.error(error);
		return res.json({ message: 'Что-то пошло не так', error });
	}
}