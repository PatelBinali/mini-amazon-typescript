import { cartService } from './cartService';
import { userService } from '../user/userService';
import { productService } from '../product/productService';
import CONSTANT from '../helper/constant';
import logger from '../helper/logger';
import status from '../helper/statusCode';
// import redisCache from '../redis/redisCache';
import { Request,Response } from 'express';
import { cart } from '../helper/routerInterface';
import { UpdateWriteOpResult } from 'mongoose';

class cartController {
	public userService:userService;
	public cartService:cartService;
	public productService:productService;
	constructor() {
		this.userService = new userService();
		this.cartService = new cartService();
		this.productService = new productService();
	}
	public getCart = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query;
			// const cacheData = JSON.parse(await redisCache.getCache(cartId));
			// if (cacheData === null) {
			const cart = await this.cartService.getCart({ _id });
			const getCartData = await this.cartService.getCartDetails({ _id });
			// await redisCache.setCache(getCartData.cartId,getCartData);
			return status.success(res,200,{ getCartData,totalPrice:cart?.totalPrice });
		// }
		// else {
		// 	return status.success(res,200,cacheData);
		// }
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'cartController getCartById':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public addCart = async (req:Request, res:Response) => {
		try { 
			const cartData:cart = req.body;
			if (cartData.buyerId === res.locals._id || res.locals.role === 'admin') {
				const buyer = await this.userService.getUser({ _id:cartData.buyerId });
				if (buyer) {
					const existingCart = await this.cartService.getCart({ buyerId:cartData.buyerId });
					if (!existingCart) {
						const addToCart = await this.cartService.addCart({ buyerId:cartData.buyerId });
						const productData = await this.productService.getProduct({ _id:cartData.productId });
						if (productData) {
							const cartDetails = await this.cartService.addCartDetails(
								{
									cartId:addToCart._id,
									productId:productData._id,
									price:productData.price,
									quantity:cartData.quantity,
									totalPrice:productData.price * cartData.quantity 
								} 
							);						
							const total:number = addToCart.totalPrice += cartDetails.totalPrice;
						
							if (cartDetails.quantity > productData.stock) {
								logger.info({ 'cartController addToCart':CONSTANT.LOGGER.OUT_OF_STOCK });
								return status.errors(res,404,{ message:CONSTANT.CART.OUT_OF_STOCK,name:'' });
							}
							else {
								await this.cartService.updateCart({ _id:addToCart._id },{ totalPrice:total });
								// await redisCache.setCache(addToCart.cartId,addToCart);
								return status.success(res,200,addToCart);
							}
						}
						else {
							logger.info({ 'cartController addToCart':CONSTANT.LOGGER.PRODUCT_NOT_FOUND });
							return status.errors(res,404,{ message:CONSTANT.PRODUCT.PRODUCT_NOT_FOUND,name:'' });
						}
					}
					else {
						const existingCartDetails = await this.cartService.getCartDetails({ cartId:existingCart._id });
						const productData = await this.productService.getProduct({ _id:cartData.productId });
						const array = [];
						for (let i = 0;i < existingCartDetails.length;i++) {
							const cart = existingCartDetails[i];
							array.push(cart);
						}
						const obj = array.find(o => o.productId === cartData.productId);					
						if (obj) {
							const quantity = obj.quantity += cartData.quantity;
							const newPrice = cartData.quantity * obj.price;
							const total = obj.totalPrice += newPrice;
							if (quantity > productData!.stock) {
								logger.info({ 'cartController addToCart':CONSTANT.LOGGER.OUT_OF_STOCK });
								return status.errors(res,404,{ message:CONSTANT.CART.OUT_OF_STOCK,name:'' });
							}
							else {
								await this.cartService.updateCartDetails({ cartId:existingCart._id, productId:obj.productId },{ totalPrice:total,quantity:quantity });
								const newTotal:number = existingCart.totalPrice += newPrice;							
								await this.cartService.updateCart({ _id:existingCart._id },{ totalPrice:newTotal });
							}
						}
						else {
							const data = {
								cartId:existingCart._id,
								productId:productData?._id,
								price:productData?.price,
								quantity:cartData.quantity,
								totalPrice:productData!.price * cartData.quantity 
							};
						
							if (data.quantity > productData!.stock) {
								logger.info({ 'cartController addToCart':CONSTANT.LOGGER.OUT_OF_STOCK });
								return status.errors(res,404,{ message:CONSTANT.CART.OUT_OF_STOCK,name:'' });
							}
							else {
								const cartDetails = await this.cartService.addCartDetails(data);	
								const totals:number = existingCart.totalPrice += cartDetails.totalPrice;
								await this.cartService.updateCart({ _id:existingCart._id },{ totalPrice:totals });
							}
						}
						// await redisCache.setCache(existingCart.cartId,existingCart);						
						return status.success(res,200,existingCart);
					}
				}
				else {
					logger.info({ 'cartController addToCart':CONSTANT.LOGGER.USER_NOT_FOUND });
					return status.errors(res,404,{ message:CONSTANT.USER.USER_NOT_FOUND,name:'' });
				}
			}
			else {
				logger.info({ 'cartController addToCart':CONSTANT.LOGGER.UNAUTHORIZED });
				return status.errors(res,401,{ message:CONSTANT.USER.UNAUTHORIZED,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message, 'cartController addToCart':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public updateCart = async (req:Request, res:Response) => {
		try {
			const cartData = req.body;
			const checkProduct = await this.productService.getProduct({ _id:cartData.productId });
			if (checkProduct) {
				const cartProduct = await this.cartService.getCart({ _id: cartData.cartId });
				if (cartProduct?.buyerId === res.locals._id || res.locals.role === 'admin') {
					cartData.price = checkProduct.price;
					cartData.totalPrice = cartData.quantity * checkProduct.price;
					if (cartData.quantity > checkProduct.stock) {
						logger.info({ 'cartController updateCart':CONSTANT.LOGGER.OUT_OF_STOCK });
						return status.errors(res,404,{ message:CONSTANT.CART.OUT_OF_STOCK,name:'' });
					}
					else {
						const updateData:UpdateWriteOpResult = await this.cartService.updateCartDetails({ cartId:cartData.cartId, productId:cartData.productId },cartData);
						const allCartDetails = await this.cartService.getCartDetails({ cartId:cartData.cartId });
						let sum = 0;
						for (let i = 0;i < allCartDetails.length;i++) {
							sum += allCartDetails[i].totalPrice;
						}
						await this.cartService.updateCart({ _id:cartData.cartId },{ totalPrice:sum });
						const updated:object|null = await this.cartService.getCartDetails({ cartId:cartData.cartId, productId:cartData.productId });
						// await redisCache.setCache(updated.cartId,updated);
						return status.success(res,200,{ updateData,updated });
					}
				}
				else {
					logger.info({ 'cartController updateCart':CONSTANT.LOGGER.PRODUCT_NOT_FOUND });
					return status.errors(res,404,{ message:CONSTANT.PRODUCT.PRODUCT_NOT_FOUND,name:'' });
				}
			}
			else {
				logger.info({ 'cartController updateCart':CONSTANT.LOGGER.PRODUCT_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.PRODUCT.PRODUCT_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message, 'cartController updateCart':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public deleteCart = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query;
			const cart = await this.cartService.getCart({ _id });
			if (cart?.buyerId === res.locals._id || res.locals.role === 'admin') {
				await this.cartService.deleteCartDetails({ cartId:_id });
				// await redisCache.deleteCache(cartId);
				await this.cartService.deleteCart({ _id });
				return status.success(res,200,{ message: CONSTANT.MESSAGE.DELETE_CART, cart });
			}
			else {
				logger.info({ 'cartController deleteCart':CONSTANT.LOGGER.CART_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.CART.CART_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'cartController deleteCart':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public deleteCartDetails = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query;
			const cartDetails = await this.cartService.getCartDetail({ _id });
			const cart = await this.cartService.getCart({ _id:cartDetails?.cartId });
			if (cart?.buyerId === res.locals._id || res.locals.role === 'admin') {
				const existingCart = await this.cartService.getCart({ _id:cartDetails?.cartId });
			existingCart!.totalPrice! -= cartDetails!.totalPrice;
			await this.cartService.updateCart({ _id:existingCart?._id },{ totalPrice:existingCart?.totalPrice });
			// await redisCache.deleteCache(Id);
			await this.cartService.deleteCartDetails({ _id });
			return status.success(res,200,{ message: CONSTANT.MESSAGE.DELETE_CART ,cartDetails });
			}
			else {
				logger.info({ 'cartController deleteCartDetails':CONSTANT.LOGGER.CART_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.CART.CART_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'cartController deleteCartDetails':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};
}
export { cartController };
