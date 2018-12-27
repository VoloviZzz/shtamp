const ShoppingCart = require('../classes/ShoppingCart');

exports.addToCart = async (req, res, next) => {

	const model = req.app.Model;

	const shoppingCart = new ShoppingCart(req);
	const myCart = shoppingCart.getCart();

	const { position_id: id } = req.body;

	var [error, positions] = await model.goodsPositions.get({ id });
	if (error) return { status: 'bad', message: 'Что-то пошло не так', error }
	if (positions.length < 1) return { status: 'bad', message: 'Позиция не найдена' }

	const position = positions[0];
	const { count: positionCount } = position;

	if (myCart.goods[id] && myCart.goods[id].countInShopCart >= positionCount) {
		return { status: 'bad', message: 'Нельзя добавить в корзину больше, чем есть в наличии' }
	}

	shoppingCart.addToCart({ id });

	return { status: 'ok', data: { cart: myCart } };
}

exports.clearCart = (req, res, next) => {
	const shoppingCart = new ShoppingCart(req);
	const myCart = shoppingCart.getCart();

	shoppingCart.clearCart();

	return { status: 'ok', data: { cart: myCart } }
}

exports.removeFromCart = (req, res, next) => {
	const shoppingCart = new ShoppingCart(req);

	shoppingCart.remove(req.body.position_id);

	return { status: 'ok' }
}

exports.editCount = async (req, res, next) => {
	const model = req.app.Model;
	const { good_id: id } = req.body;

	const shoppingCart = new ShoppingCart(req);
	const myCart = shoppingCart.getCart();

	const currentCount = shoppingCart.getProductCount(id);
	const newCount = currentCount + +req.body.vector;

	var [error, positions] = await model.goodsPositions.get({ id });
	if (error) return { status: 'bad', message: 'Что-то пошло не так', error }
	if (positions.length < 1) return { status: 'bad', message: 'Позиция не найдена' }

	const position = positions[0];
	const { count: positionCount } = position;

	if (newCount < 1) return { message: 'Количество товара не может быть меньше одного' };
	if (newCount > positionCount) return { message: 'Нельзя добавить в корзину больше, чем есть в наличии' };

	shoppingCart.setProductCount(req.body.good_id, newCount);

	return { status: 'ok' }
}