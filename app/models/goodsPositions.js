const db = require('../libs/db');

exports.add = function (data = {}) {

	const DEFAULT_PRICE = '999999999.99';

	data = {
		title: `Новый товар`,
		cat_id: '',
		price: DEFAULT_PRICE,
		contract_price: '1',
		...data
	};

	if (!!data.cat_id === false) return Promise.resolve([new Error(`Отсутствует номер категории`), null]);

	const description = data.description ? `, description = '${data.description}'` : '';
	const count = data.count ? `, count = '${data.count}'` : '';
	const price = data.price ? `, price = '${data.price}'` : '';
	const pos_id = data.pos_id ? `, pos_id = '${data.pos_id}'` : '';
	const mod_id = data.mod_id ? `, mod_id = '${data.mod_id}'` : '';
	const connect_id = data.connect_id ? `, connect_id = '${data.connect_id}'` : '';
	const service = data.service || data.service === 0 ? `, service = '${data.service}'` : '';
	const contract_price = (data.price !== DEFAULT_PRICE && data.contract_price == '1') || data.contract_price == '0' ? `, contract_price = '0'` : `, contract_price = '1'`;

	return db.insertQuery(`
		INSERT INTO 
			goods_pos 
		SET 
			title = '${data.title}',
			cat_id = '${data.cat_id}'
			${description}
			${count}
			${price}
			${pos_id}
			${mod_id}
			${connect_id}
			${service}
			${contract_price}
			, created = NOW()
		`);
}

exports.get = function (data = {}) {
	data.cat_id = typeof data.cat_id !== "undefined" ? `AND gp.cat_id = ${data.cat_id}` : ``;
	data.id = typeof data.id !== "undefined" ? `AND gp.id = ${data.id}` : ``;
	data.ids = typeof data.ids !== "undefined" ? `AND gp.id IN (${data.ids})` : ``;

	const recycled = !!data.recycled !== false ? `AND gp.recycled = ${data.recycled}` : ``;
	const connect_id = !!data.connect_id !== false ? `AND gp.connect_id = ${data.connect_id}` : ``;
	const pos_id = !!data.pos_id !== false ? `AND gp.pos_id = ${data.pos_id}` : ``;
	const mod_id = !!data.mod_id !== false ? `AND gp.mod_id = ${data.mod_id}` : ``;

	return db.execQuery(`
		SELECT gp.*,
			p.path as photo_path,
			p.name as photo_name,
			ra.alias
		FROM goods_pos gp
			LEFT JOIN photos p ON p.id = gp.main_photo
			LEFT JOIN routes_aliases ra ON ra.id = gp.alias_id
		WHERE
			gp.id > 0
			${data.cat_id}
			${data.id}
			${data.ids}
			${recycled}
			${connect_id}
			${pos_id}
			${mod_id}
	`);
}

exports.upd = function (data = {}) {
	if (!!data.value === false && data.value !== 0 && data.value !== '') return Promise.resolve([new Error('Нет value')])

	const targetIsArray = Array.isArray(data.target);
	let setData = '';

	if (targetIsArray) {
		if (Array.isArray(data.value) && data.value.length == data.target.length) {
			setData = data.target.map((target, index) => `${target} = '${data.value[index]}'`).join(',');
		}
		else {
			return Promise.reject([, new Error('Values is not array')]);
		}
	}
	else {
		setData = `${data.target} = '${data.value}'`;
	}

	return db.execQuery(`UPDATE goods_pos SET ${setData} WHERE id = ${data.id}`);
}

// используется в модуле выгрузки товаров. Отличие в том, что требуемыми ключами являются именные ключи,
// а не target и value
exports.updateByParams = function (args = {}) {

	const price = args.price || args.price === 0 ? `price = '${args.price}'` : ``;
	const count = args.count || args.count === 0 ? `count = '${args.count}'` : ``;
	const title = args.title || args.title === '' ? `title = '${args.title}'` : ``;
	const description = args.description || args.description === '' ? `description = '${args.description}'` : ``;
	const cat_data = args.cat_data || args.cat_data === '' ? `cat_id = '${args.cat_data}'` : ``;
	const recycled = args.recycled ? `recycled = '${args.recycled}'` : ``;

	const setData = [price, count, description, cat_data, title, recycled].filter(data => data !== '').join(',');

	let whereData = ``;

	if (args.id) {
		whereData = `id = '${args.id}'`;
	}
	else if (args.pos_id && args.mod_id && args.connect_id) {
		whereData = `pos_id = '${args.pos_id}' AND mod_id = '${args.mod_id}' AND connect_id = '${args.connect_id}'`
	}

	if (setData === '' || !!setData === false) {
		return Promise.resolve(['Отсутствуют данные для обновления']);
	}

	if (whereData === '' || !!whereData === false) {
		return Promise.resolve(['Отсутствуют данные для условия']);
	}

	return db.execQuery(`UPDATE goods_pos SET ${setData} WHERE ${whereData}`);
}

exports.del = function (data = {}) {
	if (!!data.id === false) return Promise.resolve(['Нет параметра id для удаления категории', null]);
	return db.execQuery(`
		DELETE FROM goods_pos
		WHERE id = ${data.id}
	`);
}