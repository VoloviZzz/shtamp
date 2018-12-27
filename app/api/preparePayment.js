const db = require('../libs/db');
const md5 = require('md5');

exports['preparePayment'] = async (req, res, next) => {
	var res = { 'status': '', 'params': '' };

	if (!!req.body.invoice === false && req.body.invoice === '') return { message: 'inputerror' };

	var invoice = req.body.invoice.replace(/[^0-9]/, '');

	if (invoice != req.body['invoice']) return { message: 'paramserror' };

	var [error, queryInvoice] = await db.execQuery(`SELECT * FROM invoices WHERE id = '${invoice}'`);
	if (error) return { message: 'Что-то пошло не так' };

	for (var invoice of queryInvoice) {
		var str = 'kpru:' + invoice['amount'] + ':' + invoice['id'] + ':oetfs01wkG';
		var descs = { 'nec': 'Оплата размещения некролога', assign: 'Оплата возложения цветов' };

		res['params'] = 'MrchLogin=kpru&OutSum=' + invoice['amount'] + '&InvId=' + invoice['id'] + '&Desc=' + descs[invoice['targtype']] + '&SignatureValue=' + md5(str);
		res['status'] = 'complete';
	}

	return { status: 'ok', data: res };
}