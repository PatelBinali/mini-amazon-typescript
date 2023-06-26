import express, { Router } from 'express';
import { user } from '../user/user';
import { product } from '../product/product';
import { cart } from '../cart/cart';
import { order } from '../order/order';

export class Routes {
	public router: Router;
	public user: user;
	public product: product;
	public cart: cart;
	public order: order;

	constructor() {
		this.router = express.Router();
		this.user = new user();
		this.product = new product();
		this.cart = new cart();
		this.order = new order();
		this.route();
	}

	route(): void {
		this.router.use('/user', this.user.router);
		this.router.use('/product', this.product.router);
		this.router.use('/cart', this.cart.router);
		this.router.use('/order', this.order.router);
	}
}
