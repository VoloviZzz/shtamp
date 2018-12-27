const db = require("../libs/db");

exports.get = (args = {}) => {
	return new Promise(async function (resolve, reject) {
		let { id = '', url = '', dynamic = '', access = '', allow_index = '' } = args;

		if (!!id === true) id = `AND r.id = ${id}`;
		if (!!url === true) url = `AND r.url = '${url}'`;
		if (!!dynamic === true) dynamic = `AND r.dynamic = '${dynamic}'`;
		if (!!access === true) access = `AND r.access = '${access}'`;
		if (!!allow_index === true) allow_index = `AND r.allow_index = '${allow_index}'`;

		let [err, rows] = await db.execQuery(`
            SELECT r.*,
            	t.title as template_title,
            	t.name as template_name,
				rt.title as target,
				rt.used_table,
				rt.object_target_id,
				rt.url_to_object
            FROM routes r
            	LEFT JOIN templates t ON r.template_id = t.id
				LEFT JOIN routes_targets rt ON rt.id = r.target_id
            WHERE r.id > 0 
				${id}
				${dynamic}
				${access}
				${allow_index}
		`);

		if (err) throw new Error(err);

		if (!!id === true) rows = rows[0];

		resolve([null, rows]);
	})
}


exports.add = async ({ url, title, dynamic, access, seo_keywords, seo_description, template_id, allow_index }) => {
	if (!!url === false || !!title === false) return Promise.resolve([{ message: 'Отсутствуют необходимые параметры для добавления маршрута' }])

	if (typeof dynamic != 'undefined') dynamic = `, dynamic = ${dynamic}`;
	if (typeof access != 'undefined') access = `, access = ${access}`;
	if (typeof seo_keywords != 'undefined') seo_keywords = `, seo_keywords = '${seo_keywords}'`;
	if (typeof seo_description != 'undefined') seo_description = `, seo_description = '${seo_description}'`;
	if (typeof template_id != 'undefined') template_id = `, template_id = '${template_id}'`;
	if (typeof allow_index != 'undefined') allow_index = `, allow_index = '${allow_index}'`;

	const [err, insertId] = await db.insertQuery(`INSERT INTO routes SET url = '${url}', title = '${title}' ${dynamic} ${access} ${seo_description} ${seo_keywords} ${allow_index} ${template_id}`);
	if (err) throw new Error(err);

	const [queryErr, newRoute] = await exports.get({ id: insertId });
	return Promise.resolve([null, newRoute]);
}

exports.del = ({ id }) => {
	if (!!id === false) return Promise.resolve([{ message: 'Отсутствует параметр id' }]);
	return db.execQuery(`DELETE FROM routes WHERE id = ${id}`);
}

exports.upd = (arg = {}) => {

	if (!!arg.id === false) return resolve([{ message: 'Отсутствует параметр id' }]);

	arg.title = !!arg.title === true ? `, title = '${arg.title}'` : ``;
	arg.url = !!arg.url === true ? `, url = '${arg.url}'` : ``;
	arg.name = !!arg.name === true ? `, name = '${arg.name}'` : ``;
	arg.dynamic = typeof arg.dynamic !== 'undefined' ? `, dynamic = '${arg.dynamic}'` : ``;

	arg.access = typeof arg.access !== 'undefined' ? `, access = '${arg.access}'` : ``;
	arg.edit_access = typeof arg.edit_access !== 'undefined' ? `, edit_access = '${arg.edit_access}'` : ``;
	arg.delete_access = typeof arg.delete_access !== 'undefined' ? `, delete_access = '${arg.delete_access}'` : ``;

	arg.menu = typeof arg.menu !== 'undefined' ? `, menu_id = '${arg.menu}'` : ``;
	arg.template_id = typeof arg.template_id !== 'undefined' ? `, template_id = '${arg.template_id}'` : ``;
	arg.target_id = typeof arg.target_id !== 'undefined' ? `, target_id = '${arg.target_id}'` : ``;

	arg.seo_description = typeof arg.seo_description !== 'undefined' ? `, seo_description = '${arg.seo_description}'` : ``;
	arg.seo_keywords = typeof arg.seo_keywords !== 'undefined' ? `, seo_keywords = '${arg.seo_keywords}'` : ``;

	arg.show_title = typeof arg.show_title !== 'undefined' ? `, show_title = '${arg.show_title}'` : ``;
	arg.use_component_title = 'use_component_title' in arg !== 'undefined' ? `, use_component_title = '${arg.use_component_title}'` : ``;

	arg.allow_index = 'allow_index' in arg ? `, allow_index = '${arg.allow_index}'` : ``;

	arg.targetValue = '';

	if (arg.target && arg.value == "null") {
		arg.targetValue = `, ${arg.target} = NULL`
	}
	else if (arg.target && typeof arg.value != "undefined") {
		arg.targetValue = `, ${arg.target} = '${arg.value}'`;
	}


	return db.execQuery(`UPDATE routes
		SET updated = NOW() 
			${arg.title} 
			${arg.url} 
			${arg.name} 
			${arg.dynamic} 
			${arg.access} 
			${arg.menu} 
			${arg.targetValue} 
			${arg.seo_keywords} 
			${arg.seo_description}
			${arg.template_id}
			${arg.allow_index}
			${arg.delete_access}
			${arg.edit_access}
			${arg.show_title}
			${arg.use_component_title}
			${arg.target_id}
		WHERE id = ${arg.id}`)
}