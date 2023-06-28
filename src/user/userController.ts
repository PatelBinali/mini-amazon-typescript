import { userService } from './userService';
import { productService } from '../product/productService';
import { cartService } from '../cart/cartService';
import { orderService } from '../order/orderService';
import { Request, Response } from 'express';
// import redisCache from '../redis/redisCache';
import status from '../helper/statusCode';
import CONSTANT from '../helper/constant';
import logger from '../helper/logger';
import bcryptPassword from '../validation/hashPassword';
import bcrypt from 'bcrypt';
import { jwtToken } from '../validation/jwtToken';
import jwt from 'jsonwebtoken';
import { admin, user } from '../helper/routerInterface';
import { UpdateWriteOpResult } from 'mongoose';

class userController {
	public userService:userService;
	public cartService:cartService;
	public productService:productService;
	public orderService:orderService;
	public jwtToken:jwtToken;
	public bcryptPassword:bcryptPassword;
	constructor() {
		this.userService = new userService();
		this.cartService = new cartService();
		this.productService = new productService();
		this.orderService = new orderService();
		this.jwtToken = new jwtToken();
		this.bcryptPassword = new bcryptPassword();
	}

	public getUser = async (req: Request, res: Response) => {
		try {
			const { _id:string } = req.query;
			// const cacheData = JSON.parse(await redisCache.getCache(_id));
			// if (cacheData === null) {
			const user:object|null = await this.userService.getUser({ _id:string,deletedAt:{ $eq:null } });
			if (!user) {
				logger.info({ 'userController getUser':CONSTANT.LOGGER.USER_NOT_FOUND });
				return status.errors(res,404,{ message: CONSTANT.USER.USER_NOT_FOUND,name: '' });
			}
			// else {
			// 	await redisCache.setCache(_id,user);
			return status.success(res,200,user);
			// }
			// }
			// else {
			// 	return status.success(res,200,cacheData);
			// }
		}
		catch (error: any) {
			logger.error({ 'error':error.message,'userController getUser':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public login = async (req:Request,res:Response) => {
		try {
			const email:string = req.body.email;
			const password:string = req.body.password;
			const userData = await this.userService.getUser({ email,deletedAt:{ $eq:null } });
			// console.log(userData);
			if (!userData) {
				logger.info({ 'userController login':CONSTANT.LOGGER.INVALID_DATA });
				return status.errors(res,404,{ message:CONSTANT.USER.INVALID_DATA,name:'' });
			}
			else {
				const isMatch:boolean = await bcrypt.compare(password, userData.password);
				if (isMatch) {
					const token = await jwtToken.token(userData);
					res.cookie(token.refreshToken,{ secure: true ,httpOnly: true });
					return status.success(res,200, { userData, token });
				}
				else {
					logger.info({ 'userController login':CONSTANT.LOGGER.INVALID_DATA });
					return status.errors(res,404,{ message:CONSTANT.USER.INVALID_DATA,name:'' });
				}
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController login':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};
	public userList = async (req: Request, res: Response) => {
		try {
			const { searchTerm } = req.query;
			const userList = await this.userService.userList(searchTerm);
			return status.success(res,200,userList);
		}
		catch (error:any) {
			logger.error({ 'error':error.message, 'userController userList':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public adminSignUp = async (req:Request, res:Response) => {
		try {
			const user:user = req.body;
			const existingUser = await this.userService.getUser({ email:user.email });
			if (!existingUser) {
				if (user.role === 'admin') {
					const pass:string = await this.bcryptPassword.bcryptPassword(user.password);
					user.password = pass;
					const adminData:object|null = await this.userService.userSignUp(user);
					// await redisCache.setCache(adminData._id,adminData);
					return status.success(res,200,adminData);
				}
				else {
					logger.info({ 'userController adminSignUp':CONSTANT.LOGGER.UNAUTHORIZED });
					return status.errors(res,401,{ message:CONSTANT.USER.UNAUTHORIZED,name:'' });
				}
			}
			else if (existingUser) {
				logger.info({ 'userController adminSignUp':CONSTANT.LOGGER.BAD_REQUEST_EMAIL });
				return status.errors(res,400,{ message:CONSTANT.USER.BAD_REQUEST_EMAIL,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message, 'userController adminSignUp':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public userSignUp = async (req:Request, res:Response) => {
		try {
			const user:user = req.body;
			const existingUser:object | null = await this.userService.getUser({ email:user.email });
			if (!existingUser) {
				if (user.role !== 'admin') {
					const pass:string = await this.bcryptPassword.bcryptPassword(user.password);
					user.password = pass;
					const newUser:object|null = await this.userService.userSignUp(user);
					return status.success(res,200,newUser);
				}
				else {
					logger.info({ 'userController signUp':CONSTANT.LOGGER.UNAUTHORIZED });
					return status.errors(res,401,{ message:CONSTANT.USER.UNAUTHORIZED,name:'' });
				}
			}
			logger.info({ 'userController signUp':CONSTANT.LOGGER.BAD_REQUEST_EMAIL });
			return status.errors(res,400,{ message:CONSTANT.USER.BAD_REQUEST_EMAIL,name:'' });
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController signUp':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public updateUser = async (req:Request, res:Response) => {
		try {
			const user = req.body;
			const token_id = res.locals._id;
			const existingUser = await this.userService.getUser({ _id:token_id,deletedAt:{ $eq:null } });
			if (user._id === existingUser!._id.toString() || res.locals.role === 'admin') {
				const pass:string = await this.bcryptPassword.bcryptPassword(user.password);
				user.password = pass;
				const updatedUser:UpdateWriteOpResult = await this.userService.updateUser({ _id:user._id,deletedAt:{ $eq:null } },user);
				const updated:object|null = await this.userService.getUser({ _id:user._id,deletedAt:{ $eq:null } });
				// await redisCache.setCache(updated._id,updated);
				return status.success(res,200,{ updatedUser,updated });
			}
			else {
				logger.info({ 'userController updateUser':CONSTANT.LOGGER.UNAUTHORIZED });
				return status.errors(res,401,{ message:CONSTANT.USER.UNAUTHORIZED, name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController updateUser':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public deleteUser = async (req:Request,res:Response) => {
		try {
			const { _id } = req.query;
			const existingUser = await this.userService.getUser({ _id,deletedAt:{ $eq:null } });
			if (existingUser) {
				if (_id === res.locals._id && existingUser.role === 'seller' || res.locals.role === 'admin') {
				// seller
					await this.productService.deleteProduct({ sellerId:_id });
					// await redisCache.deleteCache(_id);
					await this.userService.deleteUser({ _id });
					const deletedUser = await this.userService.getUser({ _id });
					return status.success(res,200,{ message: CONSTANT.MESSAGE.DELETE_USER ,deletedUser });
				}
				else if (_id === res.locals._id && existingUser.role === 'buyer' || res.locals.role === 'admin') {
				// buyer
					await this.cartService.deleteCart({ buyerId:_id });
					// await this.cartService.deleteCartDetails({ cartId:await this.cartService.getCart({ buyerId:_id }) });
					await this.orderService.cancleOrder({ buyerId:_id });
					// await this.orderService.cancleOrderDetails({ orderId:await this.orderService.order({ buyerId:_id }) });
					// await redisCache.deleteCache(_id);
					await this.userService.deleteUser({ _id });
					const deletedUser = await this.userService.getUser({ _id });
					return status.success(res,200,{ message: CONSTANT.MESSAGE.DELETE_USER ,deletedUser });
				}
				else {
					logger.info({ 'userController deleteUser':CONSTANT.LOGGER.UNAUTHORIZED });
					return status.errors(res,401,{ message:CONSTANT.USER.UNAUTHORIZED,name:'' });
				}
			}
			else {
				logger.info({ 'userController deleteUser':CONSTANT.LOGGER.USER_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.USER.USER_NOT_FOUND ,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController deleteUser':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public addPermission = async (req:Request, res:Response) => {
		try {
			const addPermission:admin = req.body;
			const permission:object|null = await this.userService.addPermission(addPermission);
			return status.success(res,200,permission);
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController addPermission':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public permissionList = async (req:Request, res:Response) => {
		try {
			const allpermission:object | null = await this.userService.permissionList();
			return status.success(res,200,allpermission);
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController allPermission':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public deletePermission = async (req:Request, res:Response) => {
		try {
			const { _id } = req.query;
			const permission:object | null = await this.userService.getPermission({ _id,deletedAt:{ $eq:null } });
			if (permission) {
				await this.userService.deletePermission({ permissionId:_id });
				return status.success(res,200,{ message:CONSTANT.ADMIN.PERMISSION_DELETED });
			}
			else {
				logger.info({ 'userController deletePermission':CONSTANT.LOGGER.PERMISSION_NOT_FOUND });
				return status.errors(res,404,{ message:CONSTANT.ADMIN.PERMISSION_NOT_FOUND,name:'' });
			}
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController deletePermission':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};

	public logout = async (req:Request,res:Response) => {
		try {
			const authHeader:string | undefined = req.headers['authorization'];
			jwt.sign(authHeader!, '', { expiresIn: 1 } , (logout:any) => {
				if (logout) {
					return status.success(res,200,{ message : 'You have been Logged Out' });
				}
				else {
					return status.errors(res,400,{ message:'error',name:'' });
				}
			});
		}
		catch (error:any) {
			logger.error({ 'error':error.message,'userController logout':CONSTANT.LOGGER.INTERNAL_SERVER_ERROR });
			return status.errors(res,500,error);
		}
	};
}

export { userController };