const db = require('../../../libs/db');

module.exports = async (req, res, next) => {

	if (!req.body.id) return res.json({ status: 'bad', message: 'Missing id' });

	const allowFields = ['title'];
	const fields = Object.keys(req.body)
		.filter(key => allowFields.includes(key))
		.reduce((acc, key) => (acc[key] = req.body[key], acc), {});

	const [error] = await db.execQuery(`UPDATE connected_crm SET ? WHERE id = '${req.body.id}'`, fields);
	
	if (error)
		return res.json({ status: 'bad', message: error.message });


	return res.json({ status: 'ok' });
}