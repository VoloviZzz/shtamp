const db = require('../libs/db');

exports.add = (args) => {

	const defaultData = {
		image: '/img/image-not-found.jpg'
	};

	const { fragment_id } = args;
	const image = args.image || defaultData.image;

	if (!!fragment_id === false) throw new Error(`Отсутствует fragment_id`);

	return db.insertQuery(`INSERT INTO slides SET image = '${image}', fragment_id = ${fragment_id}`);
};
exports.get = () => { };

exports.upd = (args) => {
	const { target, value, id } = args;

	if (!!target === false) throw new Error(`Отсутствует target`);
	if (!!value === false && value !== '') throw new Error(`Отсутствует value`);
	if (!!id === false) throw new Error(`Отсутствует id`);

	return db.execQuery(`UPDATE slides SET ${target} = '${value}' WHERE id = ${id}`);
};

exports.delete = (args) => {
	const { id } = args;

	if (!!id === false) throw new Error(`Отсутствует id`);

	return db.execQuery(`DELETE FROM slides WHERE id = ${id}`);
};