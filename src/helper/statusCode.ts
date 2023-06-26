import { Response } from 'express';

interface IStatus {
    // eslint-disable-next-line no-unused-vars
    success: (res: any, statusCode: number, data: any) => Promise<any>
    // eslint-disable-next-line no-unused-vars
    errors: (res: any, statusCode: number, error: Error) => Promise<any>
}

const status: IStatus = {
	success:async (res:Response, statusCode:number, data:any) => {
		return res.status(statusCode).json({ statusCode, data });
	},
	errors:async (res:Response, statusCode:number, error:Error) => {
		return res.status(statusCode).json({ statusCode, error: error.message });
	}

};
export default status;