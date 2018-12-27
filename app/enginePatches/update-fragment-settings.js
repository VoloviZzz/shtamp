const db = require('../libs/db');

module.exports = async () => {
	var [error, fragments] = await db.execQuery(`SELECT id, settings FROM fragments WHERE settings IS NOT NULL`);
	var [error, currentSettings] = await db.execQuery(`SELECT * FROM fragments_settings`);

	var fragmentsState = currentSettings.reduce((state, item) => {
		const { fragment_id, target, value } = item;

		state[fragment_id] = state[fragment_id] || {};
		state[fragment_id][target] = value;
		return state;
	}, {});

	for (const fragment of fragments) {
		let { id, settings } = fragment;
		settings = JSON.parse(settings);

		for (const key of Object.keys(settings)) {
			const value = settings[key];

			if(fragmentsState[id] && key in fragmentsState[id]) continue;

			var [error] = await db.execQuery(`INSERT INTO fragments_settings SET ?`, { fragment_id: id, target: key, value });

			if (error) {
				console.error(error);
			}
		}
	}
};