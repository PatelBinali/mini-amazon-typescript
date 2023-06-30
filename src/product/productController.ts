import CONSTANT from '../helper/constant';
import { productService } from './productService';
import { cartService } from '../cart/cartService';
import logger from '../helper/logger';
import status from '../helper/statusCode';
import redis from '../redis/redisCache';
import { Request, Response } from 'express';
import { productData } from '../helper/routerInterface';
import { UpdateWriteOpResult } from 'mongoose';

class productController {
	public cartService:cartService;
	public productService:productService;
	constructor() {
		this.cartService = new cartService();
		this.productService = new productService();
	}
	public getProduct = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query as {_id:string};
			const cacheData = JSON.parse(await redis.getCache(_id)as string);
			if (cacheData === null) {
				const productData:object | null = await this.productService.getProducts({ _id,deletedAt:{ $eq:null } });
				if (!productData) {
					logger.info({ 'productController getProduct':CONSTANT.LOGGER.PRODUCT_NOT_FOUND });
					return status.errors(res,404,{ message:CONSTANT.PRODUCT.PRODUCT_NOT_FOUND,name:'' });
				}
				else {
					await redis.setCache(_id,productData);
					return status.success(res,200,productData);
				}
			}
			else {
				return res.json(cacheData);
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'productController getProduct':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public productList = async (req:Request, res:Response) => {
		try {
			let { searchTerm ,price } = req.query as unknown as {searchTerm:string, price:number};
			// let { productName } = req.query;
			const products = await this.productService.productList(searchTerm,price);
			return status.success(res,200,products);
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'productController allProduct':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public addProduct = async (req:Request, res:Response) => {
		try {
			const productData:productData = req.body;
			productData.sellerId = res.locals._id;	
			const newProductData = await this.productService.addProduct(productData);
			await redis.setCache(newProductData._id,newProductData);
			return status.success(res,200,newProductData);
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'productController addProduct':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public updateProduct = async (req:Request, res:Response) => {
		try {
			const productData:productData = req.body;
			const existingProduct = await this.productService.getProduct({ _id:productData._id,deletedAt:{ $eq:null } });
			if (existingProduct!.sellerId.toString() === res.locals._id || res.locals.role === 'admin') {
				const updatedProduct:UpdateWriteOpResult = await this.productService.updateProduct({ _id:productData._id,deletedAt:{ $eq:null } },productData);
				const existingCart = await this.cartService.getCartDetails({ productId:productData._id });
				if (existingCart) {
					for (let i = 0;i < existingCart.length;i++) {
						let sum = 0;
						existingCart[i].price = productData.price;
						const totalPrice = existingCart[i].quantity * existingCart[i].price;						
						await this.cartService.updateCartDetails({ productId:existingCart[i].productId, cartId:existingCart[i].cartId },{ price:existingCart[i].price,totalPrice:totalPrice });																		
						const cart = await this.cartService.getCartDetails({ cartId:existingCart[i].cartId });
						for (let i = 0;i < cart.length;i++) {
							sum += cart[i].totalPrice;					
							await this.cartService.updateCart({ _id:cart[i].cartId },{ totalPrice:sum });
						}
					} 
					const updatedData = await this.productService.getProduct({ _id:productData._id });
					await redis.setCache(updatedData!._id,updatedData);
					return status.success(res,200,{ updatedProduct,updatedData });
				}
				else {
					logger.info({ 'productController updateProduct':CONSTANT.LOGGER.CART_NOT_FOUND });
					return status.errors(res,404,{ message:CONSTANT.CART.CART_NOT_FOUND,name:'' });
				}
			}
			else {
				logger.info({ 'productController updateProduct':CONSTANT.LOGGER.INVALID_DATA });
				return status.errors(res,404,{ message:CONSTANT.PRODUCT.INVALID_DATA,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'productController updateProduct':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public deleteProduct = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query as {_id:string};
			const existingProduct = await this.productService.getProduct({ _id,deletedAt:{ $eq:null } });
			if (existingProduct?.sellerId.toString() === res.locals._id || res.locals.role === 'admin') {
				await this.productService.deleteProduct({ _id:_id,sellerId:existingProduct?.sellerId.toString() });
				await redis.deleteCache(_id);
				return status.success(res,200,{ message:CONSTANT.MESSAGE.DELETE_PRODUCT, existingProduct });
			}
			else {
				logger.info({ 'productController deleteProduct':CONSTANT.LOGGER.PRODUCT_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.PRODUCT.PRODUCT_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'productController deleteProduct':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};
}

export { productController };
