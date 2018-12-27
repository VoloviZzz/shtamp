const db = require('../libs/db');

exports.get = async (arg = {}) => {

	const resFragments = [];

	arg.route_id = !!arg.route_id === true ? `AND f.route_id = ${arg.route_id}` : '';
	arg.public = !!arg.public === true ? `AND f.published = '${arg.public}'` : '';
	arg.id = 'id' in arg ? `AND f.id = ${arg.id}` : '';

	var [error, fragments] = await db.execQuery(`
            SELECT f.*,
                c.title as component_title,
                c.ctrl as component_ctrl,
                c.styles as component_styles,
                c.scripts as component_scripts,
                c.static as isStatic,
                c.default_config as component_config,
                c.once
            FROM fragments f
                LEFT JOIN components c ON f.component_id = c.id
            WHERE f.id > 0 
                ${arg.route_id}
				${arg.public}
				${arg.id}
            ORDER BY f.priority DESC, f.id ASc`
	);

	if (error) {
		console.error(error);
		throw new Error(error);
	}

	for (const fragment of fragments) {
		const { id: fragment_id } = fragment;

		var [error, settings = []] = await db.execQuery(`SELECT * FROM fragments_settings WHERE fragment_id = ?`, [fragment_id]);
		if (error) {
			console.error(error);
			throw new Error(error);
		}

		const settingsObj = settings.reduce((state, item) => {
			state[item.target] = item.value;
			return state;
		}, {});

		fragment.settings = settingsObj;
		resFragments.push(fragment);
	}

	return Promise.resolve([error, resFragments]);
}

exports.getFragmentsData = async (arg = { id: false, fragment_id: false }) => {

	arg.id = !!arg.id === true ? `AND id = ${arg.id}` : '';
	arg.fragment_id = !!arg.fragment_id === true ? `AND fragment_id = ${arg.fragment_id}` : '';

	const fragmentsData = await db.execQuery(`
            SELECT *
            FROM fragments_data
            WHERE id > 0
                ${arg.id}
                ${arg.fragment_id}
        `)

	return Promise.resolve(fragmentsData)
}

exports.setData = async function ({ fragment_id, data }) {

	var [err, fragmentData] = await exports.getFragmentsData({ fragment_id })
	if (err) throw new Error(err);

	let strData = JSON.stringify({ content: data });

	if (fragmentData.length < 1) {
		return db.insertQuery("INSERT INTO fragments_data SET ?", { fragment_id, data: strData });
	}
	else {
		data = Object.assign(JSON.parse(fragmentData[0].data).content, data);
		strData = JSON.stringify({ content: data });
		return db.execQuery("UPDATE fragments_data SET data = ? WHERE fragment_id = ?", [strData, fragment_id]);
	}
}

exports.add = async (args = {}) => {
	args.component_id = args.component_id ? `, component_id = ${args.component_id}` : ``;
	args.block_id = args.block_id ? `, block_id = ${args.block_id}` : ``;
	return db.execQuery(`INSERT INTO fragments SET route_id = ${args.route_id} ${args.component_id} ${args.block_id}`);
}

exports.upd = async (args = {}) => {
	const res = await db.execQuery(`UPDATE fragments SET ${args.target} = '${args.value}' WHERE id = ${args.id}`);
	return Promise.resolve(res);
}

exports.delete = function ({ id }) {
	return db.execQuery(`DELETE FROM fragments WHERE id = ${id}`);
}