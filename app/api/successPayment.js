const db = require('../libs/db');
const md5 = require('md5');

exports['successPayment'] = async (req, res, next) => {

	if (!!req.body['OutSum'] !== false && !!req.body['InvId'] !== false && !!req.body['SignatureValue'] !== false) return {};

	var invoice = req.body['InvId'];
	var amount = req.body['OutSum'];

	if (md5(amount + ':' + invoice + ':oetfs01wkG') == req.body['SignatureValue']) {
		var [error, [inv]] = await db.execQuery(`SELECT * FROM invoices WHERE id = '${invoice}'`);
		if (error) return error;

		if (inv['status'] !== 'paid') {
			await db.execQuery(`UPDATE invoices SET status = 'expect' WHERE id = '${invoice}' LIMIT 1`);
		}
		if (inv['targtype'] == 'assign') {
			var [error, [o]] = await db.execQuery(`SELECT * FROM flowerassign WHERE id = ${inv['targid']} LIMIT 1`);
			if (error) return error;

			return res.redirect(`/public/cemeteries/person/?i=${o['pers']}`);
		}
		else {
			return res.redirect(`/my-cart`);
		}
	}
}