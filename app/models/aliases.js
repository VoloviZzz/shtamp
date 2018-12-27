const db = require('../libs/db');
const storage = require('../storage');

exports.get = function (data = {}) {

	const id = !!data.id === true ? `AND a.id = ${data.id}` : '';
	const alias = !!data.alias === true ? `AND a.alias = '${data.alias}'` : '';
	const route_id = !!data.route_id ? `AND a.route_id = '${data.route_id}'` : ``;
	const params = !!data.params ? `AND a.params = '${data.params}'` : ``;
	const main = !!data.main ? `AND a.main = '${data.main}'` : ``;

	return db.execQuery(`
		SELECT a.*,
			a.alias as url, 
			r.url as route_url,
			t.title as template_title,
			t.name as template_name
		FROM routes_aliases a 
			LEFT JOIN routes r ON r.id = a.route_id
			LEFT JOIN templates t ON r.template_id = t.id
		WHERE a.id > 0
			${id}
			${alias}
			${route_id}
			${params}
			${main}
	`);
}

exports.add = async (data = {}) => {

	const routesMap = storage.get('routesMap');
	const { route_id, params, alias } = data;

	if ([route_id, params, alias].includes(undefined) === true) {
		throw new Error('Отсутствуют обязательные параметры');
	}

	const q = `INSERT INTO routes_aliases SET ?`;
	const addData = { route_id, alias, params };

	var [error, copyAlias] = await exports.get({ alias: alias });
	if (error) {
		console.error(error);
		throw new Error(error);
	}

	if (copyAlias.length > 0) {
		return Promise.resolve(['Существует алиас с таким адресом']);
	}

	var [error, aliasId] = await db.insertQuery(q, addData);
	if (error) {
		console.error(error);
		throw new Error(error);
	}

	var [error, createdAlias] = await exports.get({ id: aliasId });
	if (error) {
		console.error(error);
		throw new Error(error);
	}

	routesMap[alias] = createdAlias[0];
	return Promise.resolve([, aliasId]);
}