import jwt from 'jsonwebtoken';
import CONSTANT from '../helper/constant';
// import db from '../model/config';
import logger from '../helper/logger';
import status from '../helper/statusCode';
import { Request, Response, NextFunction } from 'express';
import usermongo from '../model/userModel';
import permissionmongo from '../model/permission';

class Auth {
	public authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
		const authHeader:string|undefined = req.headers['authorization'];
		if (authHeader !== undefined) {
			const bearer = authHeader.split(' ');
			const bearerToken:string = bearer[1];
			jwt.verify(bearerToken, CONSTANT.JWT.SECRET, async (err,token:any) => {
				if (token) {
					const _id:string = token._id;
					const route:string = req.originalUrl.split('?')[0];
					const user = await usermongo.findOne({ _id });
					const role = user!.role;
					const permission:object|null = await permissionmongo.findOne({ role, route });
					if (!permission) {
						logger.info({ 'authMiddleware': CONSTANT.LOGGER.UNAUTHORIZED });
						return status.errors(res, 401, { message: CONSTANT.USER.UNAUTHORIZED, name: '' });
					}
					token.role = role;
					res.locals = token;
					
					next();
				}
				else {
					return status.errors(res, 401, { message: CONSTANT.USER.UNAUTHORIZED, name: '' });
				}
			});
		}
		else {
			logger.info({ 'authMiddleware':CONSTANT.LOGGER.UNAUTHORIZED });
			return status.errors(res, 401, { message: CONSTANT.USER.UNAUTHORIZED, name:'' });
		}
	};
}
export { Auth };