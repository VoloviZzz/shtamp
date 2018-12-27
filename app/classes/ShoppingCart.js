class ShoppingCart {
	constructor(req) {
		this.cart = this.init(req);
	}

	init(req) {
		if (!!req.session.user === false) req.session.user = {};
		if (req.session.shoppingCart) return req.session.shoppingCart;

		return req.session.shoppingCart = {
			totalCountGoods: 0,
			totalPrice: 0,
			goods: {}
		};
	}

	getCart() {
		return this.cart;
	}

	addToCart(someProduct = {}) {
		this.cart.totalCountGoods++;

		if (typeof this.cart.goods[someProduct.id] !== 'undefined') {
			this.cart.goods[someProduct.id].countInShopCart = this.cart.goods[someProduct.id].countInShopCart + 1;
		}
		else {
			this.cart.goods[someProduct.id] = someProduct;
			this.cart.goods[someProduct.id].countInShopCart = 1;
		}
	}

	remove(product_id) {
		if (typeof this.cart.goods[product_id] === 'undefined') {
			return false;
		}

		const productCount = this.getProductCount(product_id);
		this.cart.totalCountGoods -= productCount;

		delete this.cart.goods[product_id];
	}

	getProductCount(product_id) {
		return this.cart.goods[product_id].countInShopCart;
	}

	setProductCount(product_id, count) {
		const oldCount = this.getProductCount(product_id);
		const newCount = count;
		const difference = oldCount - newCount;
		this.cart.totalCountGoods -= difference;
		return this.cart.goods[product_id].countInShopCart = count;
	}

	clearCart() {
		this.cart.totalCountGoods = 0;
		this.cart.totalPrice = 0;
		this.cart.goods = {};
	}
}

module.exports = ShoppingCart;