const path = require('path');

/**
 * @param cat array
 * @param id int
 * @return array
 * Получаем массив для хлебных крошек
 */
const breadcrumb = (cat, id) => {

	//Создаем пустой массив
	const brc = {};

	for (const node of Object.values(cat)) {
		//Проверяем что мы не нашли родителя и не массив пуст
		if (id != 0 && !!cat[id] !== false) {
			//Ищем родителя
			brc[cat[id]['id']] = cat[id]['title'];
			id = cat[id]['parent_id'];
		}
		//Останавливаем цикл
		else break;
	}

	//Возвращаем перевернутый массив с сохранением ключей
	return brc;
}

module.exports = (app) => {
	const Model = app.Model;
	return ({ locals, session, dataViews } = {}) => {
		return new Promise(async (resolve, reject) => {


			const object_id = locals.dynamicRouteNumber;

			var [[error, goodsPropsBindValues], [error, goodsProps], [error, goodsCats]] = await Promise.all([
				Model.goodsPropsBindValues.get({ good_id: object_id }),
				Model.goodsProps.get(),
				Model.goodsCategories.get()
			]);

			dataViews.goodsPropsBindValues = goodsPropsBindValues;
			dataViews.goodsProps = goodsProps;

			const [posError, [pos]] = await app.Model.goodsPositions.get({ id: object_id });
			if (posError) return resolve([posError, posError.message]);
			if (!!pos === false) return resolve([, 'Страница не найдена']);

			dataViews.position = pos;

			var goodsCatsObject = goodsCats.reduce((prev, current) => {
				const { id } = current;
				prev[id] = current;
				return prev;
			}, {});

			const breadcrumbNavigation = breadcrumb(goodsCatsObject, pos.cat_id);

			dataViews.breadcrumbNavigation = breadcrumbNavigation;

			// получение похожих позиций;
			const countSimilarPosts = 5;
			var [error, similarPositions] = await app.db.execQuery(`
				SELECT gp.*,
					CONCAT(p.path, '/prod/', p.name) as prod_path,
					CONCAT(p.path, '/origin/', p.name) as origin_path,
					CONCAT(p.path, '/preview/', p.name) as preview_path
				FROM goods_pos gp
					LEFT JOIN photos p ON p.id = gp.main_photo
				WHERE gp.cat_id = '${pos.cat_id}' AND gp.id <> '${pos.id}' ORDER BY RAND() LIMIT ${countSimilarPosts}`);

			dataViews.similarPositions = similarPositions;
			locals.route.title = pos.title;

			var [error, aliases] = await Model.aliases.get({ route_id: locals.route.id, params: locals.URIparams });
			if (error) throw new Error(error);

			dataViews.aliases = aliases;

			[error, positionPhotos] = await Model.photos.get({ target: 'goodsPosition', target_id: dataViews.position.id });
			dataViews.partName = pos.service == 0 ? 'goods.ejs' : 'service.ejs';

			positionPhotos = positionPhotos.sort((a) => {
				return a.id !== dataViews.position.main_photo;
			});

			dataViews.goodsPhotos = positionPhotos;

			app.render(path.join(__dirname, 'template.ejs'), dataViews, (err, str) => {
				if (err) return resolve([err, err.toString()]);

				return resolve([err, str]);
			});
		})
	}
}