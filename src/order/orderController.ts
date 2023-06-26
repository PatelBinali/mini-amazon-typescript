import { Request, Response } from 'express';
import CONSTANT from '../helper/constant';
import logger from '../helper/logger';
import { orderService } from './orderService';
import { userService } from '../user/userService';
import { productService } from '../product/productService';
import { cartService } from '../cart/cartService';
import status from '../helper/statusCode';
import { order } from '../helper/routerInterface';
// import redisCache from '../redis/redisCache';

class orderController {
	public userService:userService;
	public cartService:cartService;
	public productService:productService;
	public orderService:orderService;
	constructor() {
		this.userService = new userService();
		this.cartService = new cartService();
		this.productService = new productService();
		this.orderService = new orderService();
	}

	public getOrder = async (req:Request, res:Response) => {
		try {
			const { orderId } = req.query;
			// const orderCache = JSON.parse(await redisCache.getCache(orderId));
			// if (orderCache === null) {
			const getOrderDetails = await this.orderService.getOrderDetailsById({ orderId });
			const order = await this.orderService.order({ _id:orderId });
			// let arr = [];
			// console.log('i');
			// for (let i = 0; i < getOrderDetails.length;i++) {
			// 	let array = {
			// 		Id:getOrderDetails[i].Id,
			// 		orderId:getOrderDetails[i].orderId,
			// 		productId:getOrderDetails[i].productId,
			// 		price:getOrderDetails[i].price,
			// 		quantity:getOrderDetails[i].quantity,
			// 		totalPrice:getOrderDetails[i].totalPrice
			// 	};
			// 	arr.push(array);
			// 	// console.log(array);
			// }
			// console.log(arr);
			// await redisCache.setCache(getOrderDetails.orderId,getOrderDetails);
			return status.success(res,200,{ getOrderDetails,totalPrice:order?.totalPrice });
		// }
		// else {
		// 	return res.json(orderCache);
		// }
		}
		catch (error:any) {
			logger.error({ 'error':error.message, 'orderController getOrderDetailsById':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public placeOrder = async (req:Request, res:Response) => {
		try {
			const placeOrder:order = req.body;
			const buyer:object | null = await this.userService.getUser({ _id: placeOrder.buyerId });
			if (buyer) {
				const cart = await this.cartService.getCart({ buyerId:placeOrder.buyerId });
				if (cart) {
					placeOrder.totalPrice = cart.totalPrice;
					const orderData = await this.orderService.placeOrder(placeOrder);
					// await redisCache.setCache(orderData.orderId,orderData);
					if (orderData) {
						const cartDetails = await this.cartService.getCartDetails({ cartId:cart._id });
						const orderId = orderData._id;
						let orderDetails = [];
						for (let i = 0; i < cartDetails.length; i++) {
							const product = await this.productService.getProduct({ _id:cartDetails[i].productId });
							if (product) {
								let order = {
									orderId,
									productId: cartDetails[i].productId,
									price: cartDetails[i].price,
									quantity: cartDetails[i].quantity,
									totalPrice: cartDetails[i].totalPrice
								};
								orderDetails.push(order);
							}
							else {
								logger.info({ 'orderController placeOrder':CONSTANT.LOGGER.PRODUCT_NOT_FOUND });
								return status.errors(res,404,{ message:CONSTANT.PRODUCT.PRODUCT_NOT_FOUND,name:'' });
							}
						}
						await this.orderService.orderDetails(orderDetails);
						// let arr = [];
						// for (let i = 0;i < details.length;i++) {
						// 	let array = {
						// 		Id:details[i].Id,
						// 		orderId:details[i].orderId,
						// 		productId:details[i].productId,
						// 		price:details[i].price,
						// 		quantity:details[i].quantity,
						// 		totalPrice:details[i].totalPrice
						// 	};
						// 	arr.push(array);
						// }
						// await redisCache.setCache(arr,arr);
						if (orderDetails) {
							let quantity = [];
							for (let i = 0;i < orderDetails.length;i++) {
								let product = {
									productId:orderDetails[i].productId,
									quantity:orderDetails[i].quantity
								};
								quantity.push(product);
								const getProduct = await this.productService.getProduct({ _id:quantity[i].productId });
							getProduct!.stock -= quantity[i].quantity;
							await this.productService.updateProduct({ _id:getProduct?._id },{ stock:getProduct?.stock });
							await this.cartService.deleteCartDetails({ productId:quantity[i].productId });
							await this.cartService.deleteCart({ _id:cart._id });
							}
						}
						return status.success(res,200,orderData);
					}
					else {
						logger.info({ 'orderController placeOrder':CONSTANT.LOGGER.ORDER_NOT_PLACED });
						return status.errors(res,400,{ message:CONSTANT.ORDER.ORDER_NOT_PLACED,name:'' });
					}
				}
				else {
					logger.info({ 'orderController placeOrder':CONSTANT.LOGGER.CART_NOT_FOUND });
					return status.errors(res,404,{ message:CONSTANT.CART.CART_NOT_FOUND,name:'' });
				}
			}
			else {
				logger.info({ 'orderController placeOrder':CONSTANT.LOGGER.USER_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.USER.USER_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'orderController placeOrder':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public cancleOrder = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query;
			const existingOrder = await this.orderService.order({ _id });
			if (existingOrder?.buyerId === res.locals._id || res.locals.role === 'admin') {
				const orderDetails = await this.orderService.getOrderDetailsById({ orderId:_id });
				if (orderDetails) {
					let product = [];
					for (let i = 0;i < orderDetails.length;i++) {
						let productData = {
							productId:orderDetails[i].productId,
							quantity:orderDetails[i].quantity
						};
						product.push(productData);
						const existingProduct = await this.productService.getProduct({ _id:product[i].productId });
						const totalStock:number = product[i].quantity += existingProduct?.stock!;
						await this.productService.updateProduct({ _id:existingProduct?._id },{ stock:totalStock });
					}
				}
				// await redisCache.deleteCache(orderId);
				await this.orderService.cancleOrderDetails({ orderId: _id });
				await this.orderService.cancleOrder({ _id });
				return status.success(res,200,{ message: CONSTANT.ORDER.ORDER_CANCELLED, existingOrder });
			}
			else {
				logger.info({ 'orderController cancleOrder':CONSTANT.LOGGER.ORDER_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.ORDER.ORDER_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message, 'orderController cancleOrder':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public cancleOrderDetails = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query;
			const existingId = await this.orderService.getOrderDetailsById({ _id });
			if (existingId) {
				const existingOrderId = await this.orderService.order({ _id:existingId[0].orderId });
				const total:number = existingOrderId!.totalPrice - existingId[0].totalPrice;
				await this.orderService.updateOrder({ _id:existingOrderId?._id },{ totalPrice:total });
				const product = await this.productService.getProduct({ _id:existingId[0].productId });
			product!.stock += existingId[0].quantity;
			await this.productService.updateProduct({ _id:product?._id },{ stock:product?.stock });
			// await redisCache.deleteCache(Id);
			await this.orderService.cancleOrderDetails({ _id });
			return status.success(res,200,{ Message: CONSTANT.ORDER.ORDER_CANCELLED , existingId });
			}
			else {
				logger.info({ 'orderController cancleOrderDetails':CONSTANT.LOGGER.ORDER_DETAILS_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.ORDER.ORDER_DETAILS_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'orderController cancleOrderDetails':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};
}
export { orderController };
