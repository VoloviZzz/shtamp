const ShoppingCart = require('../classes/ShoppingCart');
const md5 = require('md5');
const sendSoldItems = require('../unloading/functions/send_sold_items');

// добавление данных оформления заказа в сессию
exports.setOrderData = async (req, res, next) => {
	const { Model } = req.app;
	const data = req.body;

	req.session.orderData = req.body;

	// если пользователь авторизован, то просто пропускаем дальше
	if (!!req.session.user.id === true) {
		return { status: 'ok' };
	}

	// сохраняем данные с формы во временную переменную в сессию, для последующей проверки кода;
	req.session.tempOrderData = req.body;

	// проверяем, является ли номер подтвержденным
	var [error, confirmedPhones] = await Model.confirmedPhones.get({ phone: data.phone })
	let code;

	// если такого номера нет в базе, то создаём новый код и добавляем в  базу
	if (confirmedPhones.length === 0) {
		code = req.app.Helpers.getRandomNumber(6);
		[error, codeId] = await Model.confirmedPhones.add({ phone: data.phone, code });
		if (error) throw new Error(error);

		var [error, [result = { value: '' }]] = await Model.siteConfig.get({ target: 'smsTemplatePhoneConfirm' });
		var smsMessage = result.value.replace(/{{code}}/g, code);

		await app.smsc.send({ phones: req.body.phone, mes: smsMessage });

		req.session.tempOrderData.code = code;
		req.session.tempOrderData.codeId = codeId;

		return { status: 'confirm phone' }
	}
	// если номер есть в базе, но не подтверждён, то отправить пользователю уже существующий код
	else if (confirmedPhones.length == 1 && confirmedPhones[0].confirmed == '0') {

		code = confirmedPhones[0].code;
		codeId = confirmedPhones[0].id;

		req.session.tempOrderData.codeId = codeId;
		req.session.tempOrderData.code = code;


		var [error, [result = { value: '' }]] = await Model.siteConfig.get({ target: 'smsTemplatePhoneConfirm' });
		var smsMessage = result.value.replace(/{{code}}/g, code);
		await app.smsc.send({ phones: req.body.phone, mes: smsMessage });


		return { status: 'confirm phone' }
	}
	// если есть в базе и подтверждён, то просто продолжить
	else if (confirmedPhones.length == 1 && confirmedPhones[0].confirmed == '1') {
		return { status: 'ok' };
	}

}

// подтверждение номера телефона пользователя
exports.confirmPhone = async (req, res, next) => {
	const Model = req.app.Model;

	if (req.body.code == req.session.tempOrderData.code) {
		await Model.confirmedPhones.upd({ id: req.session.tempOrderData.codeId, target: 'confirmed', value: '1' })
		delete req.session.tempOrderData;
		return { status: 'ok' }
	}
	else {
		return { status: 'bad', message: 'Код неверный' };
	}
}

exports.setDeliveryData = (req, res, next) => {
	req.session.deliveryData = req.body;
	req.session.deliveryData.data = {};

	return { status: 'ok' }
}

exports.addOrder = async (req, res, next) => {
	const Model = req.app.Model;
	const shoppingCart = new ShoppingCart(req);
	const clientCart = shoppingCart.getCart();
	let order_id = false;

	const promisesArray = [];

	if (req.session.user && typeof req.session.user.id !== 'undefined') {
		req.body.client_id = req.session.user.id;
	}

	if (Object.keys(clientCart.goods).length < 1) return { message: 'Не выбрано ни одного товара.' }

	for (const { id } of Object.values(clientCart.goods)) {
		const getItemQuery = Model.goodsPositions.get({ id });
		promisesArray.push(getItemQuery);
	}

	var getPositionsResults = await Promise.all(promisesArray);
	const goodsArray = [];

	for (let [error, [position]] of getPositionsResults) {
		const { count, id } = position;
		const countInOrder = clientCart.goods[id].countInShopCart;

		if (count - countInOrder < 0) {
			return { message: `Невозможно подтвердить заказ. Товаров в корзине больше, чем есть в наличии` };
		}
	};

	getPositionsResults.forEach(([error, [position]]) => {
		const { id, pos_id, mod_id, price, connect_id, service } = position;
		const countInOrder = clientCart.goods[id].countInShopCart;

		if (!!connect_id !== false) {
			goodsArray.push({ id, pos_id, mod_id, price, count: countInOrder, service, connect_id })
		}
	});

	const { surname, firstname, patronymic, phone } = req.body;
	const name = `${surname} ${firstname} ${patronymic}`;

	// данные для экспорта товаров в программу
	const exportSendData = {
		poses: goodsArray,
		client_info: { surname, firstname, patronymic, phone, name }
	};

	const orderHash = md5(Date.now() + JSON.stringify(req.body));

	req.body.hash = orderHash;
	req.body.price = clientCart.totalPrice;

	return Model.orders.add(req.body).then(async ([error, orderId]) => {
		if (error) return { message: error.message, error, sql: error.sql }

		order_id = orderId;

		for (const good_id of Object.keys(clientCart.goods)) {
			const goodsItem = clientCart.goods[good_id];
			const [error] = await Model.ordersGoods.add({ order_id, good_id, count: goodsItem.countInShopCart, price: goodsItem.price });
		}


		var [error, [result = { value: '' }]] = await Model.siteConfig.get({ target: 'smsTemplateOrderComplete' });
		var smsMessage = result.value.replace(/{{order_id}}/g, code);

		return app.smsc.send({ phones: req.body.phone, mes: smsMessage });

	}).then(async () => {

		const updatePositionsPromises = [];

		for (const positionInCart of Object.values(clientCart.goods)) {
			const { id, countInShopCart: count } = positionInCart;

			const [error, [position]] = await Model.goodsPositions.get({ id });
			const { count: positionCount } = position;

			const newPositionCount = positionCount - count;

			const updatePositionQuery = Model.goodsPositions.upd({ target: 'count', value: newPositionCount, id });
			updatePositionsPromises.push(updatePositionQuery);
		}

		return Promise.all(updatePositionsPromises);
	}).then(async () => {
		// функция для отправки продажи с сайта в программу
		await sendSoldItems(exportSendData);
		shoppingCart.clearCart();
		return { status: 'ok', orderHash }
	}).catch(error => {
		console.log(error);
		return { message: error.message, error }
	})
}

exports.changeStatus = (req, res, next) => {
	const { hash, status } = req.body;
	const { Model } = req.app;

	return Model.orders.upd({ hash, target: 'status', value: status }).then(([error]) => {
		if (error) return { message: error.message, error };

		return { status: 'ok' }
	})
}