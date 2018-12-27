const Model = require('../models');
const db = require('../libs/db');

exports.add = async function (req, res, next) {
	let error = false;

	if (!!req.body.route_id === false) return { status: 'bad', message: 'Отсутствует route_id' };

	[error, fragmentId] = await Model.fragments.add({ route_id: req.body.route_id, component_id: 8, block_id: req.body.block_id });
	if (error) return { status: 'bad', message: error.message, error }

	return { status: 'ok' }
}

exports.upd = async function (req, res, next) {
	const { fragment_id } = req.body;

	if ('value' in req.body === false || 'target' in req.body === false || !!fragment_id === false) return { status: 'bad', message: 'Отсутствуют необходимые параметры' };

	var [error, [fragment]] = await Model.fragments.get({ id: fragment_id });
	if (error) return { status: 'bad', message: error.message, error };
	if (!!fragment === false) return { status: 'bad', message: 'Фрагмент не найден' };

	var [error, fragmentId, sql] = await Model.fragments.upd({ target: req.body.target, value: req.body.value, id: fragment_id });
	if (error) return { status: 'bad', message: error.message, error };

	return { status: 'ok' }
}

exports.updSettings = async function (req, res, next) {
	try {

		if ('value' in req.body === false || 'target' in req.body === false) return { status: 'bad', message: 'Отсутствуют необходимые параметры' };

		const { fragment_id, target, value } = req.body;

		[error, [fragment]] = await Model.fragments.get({ id: fragment_id });
		if (error) return { status: 'bad', message: error.message, error };
		if (!!fragment === false) return { status: 'bad', message: 'Фрагмент не найден' };

		var [error, checkSettings] = await db.execQuery(`SELECT * FROM fragments_settings WHERE fragment_id = '${fragment_id}' AND target = '${target}'`);

		if (checkSettings.length < 1) {
			await db.execQuery(`INSERT INTO fragments_settings SET ?`, { target, value, fragment_id });
		} else {
			await db.execQuery(`UPDATE fragments_settings SET value = ? WHERE fragment_id = ? AND target = ?`, [value, fragment_id, target]);
		}

		return { status: 'ok' }
	} catch (error) {
		console.log(error);
		return { status: 'bad', error, message: error.message };
	}
}

exports.del = async function (req, res, next) {

	const { fragment_id } = req.body;

	if (!!fragment_id === false) return { status: 'bad', message: 'Отсутствуют необходимые параметры' };

	var [error, [fragment]] = await Model.fragments.get({ id: fragment_id });
	if (error) return { status: 'bad', message: error.message, error };
	if (!!fragment === false) return { status: 'bad', message: 'Фрагмент не найден' };

	var [error, fragmentId] = await Model.fragments.delete({ id: fragment_id });
	if (error) return { status: 'bad', message: error.message, error }

	return { status: 'ok' }
}

exports.setData = async function (req, res, next) {
	const data = JSON.parse(req.body.data);

	const { fragment_id } = req.body;

	[error, [fragment]] = await Model.fragments.get({ id: fragment_id });
	if (error) return { status: 'bad', message: error.message, error };
	if (!!fragment === false) return { status: 'bad', message: 'Фрагмент не найден' };

	const [queryErr, queryRes] = await Model.fragments.setData({ fragment_id, data });
	if (queryErr) throw new Error(queryErr);

	return { status: 'ok', body: req.body };
}

exports.handler = async (req, res, next) => {
	const fragmentsHandler = require('../libs/fragments')(req.app);

	const { route_id, id } = req.body;

	const countParams = [route_id, id].filter(item => !!item).length;

	if (countParams == 0) {
		return { status: 'bad', message: 'Отсутствуют параметры для обработки фрагментов' };
	}

	var [err, fragments] = await Model.fragments.get(req.body);

	const fragmentsMap = fragments.map(async fragment =>
		fragmentsHandler(fragment, { session: { ...req.session }, locals: { ...res.locals, route: { id: req.body.route_id } } })
	);

	const fragmentsData = await Promise.all(fragmentsMap);

	return { status: 'ok', body: req.body, fragments, fragmentsData };
}