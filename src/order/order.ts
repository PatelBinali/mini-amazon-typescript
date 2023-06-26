import express, { Router } from 'express';
import { orderController } from './orderController';
import { Auth } from '../middleware/authMiddleware';
import { queryValidate, schemaValidate } from '../middleware/schemaValidation';
import { cancleOrder, cancleOrderDetails, getOrder, placeOrder } from '../validation/orderValidation';

export class order {
	public router:Router;
	public auth: Auth;
	public orderController:orderController;
	constructor() {
		this.router = express.Router();
		this.auth = new Auth();
		this.orderController = new orderController();
		this.route();
	}
    
	route(): void {
		this.router.get('/getOrder',[this.auth.authenticateToken,queryValidate(getOrder)],this.orderController.getOrder);
        
		this.router.post('/placeOrder',[this.auth.authenticateToken,schemaValidate(placeOrder)],this.orderController.placeOrder);
        
		this.router.delete('/cancleOrder',[this.auth.authenticateToken,queryValidate(cancleOrder)],this.orderController.cancleOrder);
        
		this.router.delete('/cancleOrderDetails',[this.auth.authenticateToken,queryValidate(cancleOrderDetails)],this.orderController.cancleOrderDetails);
		
	}
}


