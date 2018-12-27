const db = require('../libs/db');

exports['del_order'] = async function (req, res, next) {
	try {
		var order = req.body['order'];
		var { entrusting, invoices } = req.app.Model;

		var [error, [fa]] = await entrusting.get_entrusting({ 'id': order });

		if (fa.istat !== 'new') return { message: 'Заказы, для которых был запущен процесс оплаты, не могут быть удалены.' };

		var [error, [inv]] = await invoices.get_invoices({ 'id': fa['invoice'] });
		if (inv['status'] !== 'new') return { message: 'Заказы, для которых был запущен процесс оплаты, не могут быть удалены.' };

		var [[errorDelEntrusting], [errorDelInvoices]] = await Promise.all([entrusting.del_entrusting({ 'id': fa['id'] }), invoices.del_invoices({ 'id': inv['id'] })]);

		return { status: 'ok' };
	} catch (error) {
		return { message: 'Что-то пошло не так', error };
	}
}