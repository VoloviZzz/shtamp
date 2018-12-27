const api = require('../retail-api');
const db = require('../libs/db');

exports['create_flower_assign'] = async function (req, res, next) {

	var { entrusting, invoices } = req.app.Model;

	var mod = req.body.mod;
	var pers = req.body.pers;
	var client = req.session.user.id;
	var count = req.body.count;

	if (!!client === false) return { message: 'Доступно только для зарегистрированных пользователей' };

	var [error, reserv] = await db.execQuery(`SELECT COUNT(id) as count_res FROM flowerassign WHERE mods = ${mod} AND status = 0`);

	var flowers = await api.query('get_goods_mod', { 'id': mod });

	var free_count = flowers['shop9'] - reserv['count_res'];

	if (free_count < count) return { message: 'К сожалению отсутствует достаточное количество' };

	var [error, new_fa] = await entrusting.add_entrusting({
		'client': client,
		'mods': mod,
		'pers': pers,
		'count': count
	});

	var [error, inv] = await invoices.add_invoices({
		'client': client,
		'amount': +(flowers['pos_price'] * count) + 200,
		'targtype': 'assign',
		'targid': new_fa,
		'status': 'new'
	});

	var [error] = await entrusting.set_entrusting({
		'id': new_fa,
		'invoice': inv
	})

	if (error) {
		return { status: 'bad', message: 'Ошибка обновления данных заказа' }
	}

	return { status: 'ok', new_fa };
}