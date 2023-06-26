// import status from '../helper/statusCode';
import { Request, Response, NextFunction } from 'express' // eslint-disable-line
import { Schema } from 'joi';

const schemaValidate = (schema: Schema) => {
	return (req: Request, res: Response, next:NextFunction) => {
		const user: any = req.body;
		const resposne = schema.validate(user, { abortEarly: false });
		const errors:[]|null = validationResponse(resposne);
		if (errors) {
			res.json(errors);
		}
		else {
			next();
		}
	};
};
const queryValidate = (schema: Schema) => {
	return (req: Request, res: Response, next:NextFunction) => {
		const user: any = req.query;
		const resposne = schema.validate(user, { abortEarly: false });
		const errors:[]|null = validationResponse(resposne);
		if (errors) {
			res.json(errors);
		}
		else {
			next();
		}
	};
};
const validationResponse = (result:any) => {
	if (result && result.error && result.error.details && result.error.details.length > 0) {
		const errorMessages = result.error.details.map((error: { message: any; }) => {
			const message = error.message;
			const errorObj = { detail: message.replace(/['"]+/g, '') };
			return errorObj;
		});
		return errorMessages;
	}
	return null;
};
export { schemaValidate,queryValidate } ;