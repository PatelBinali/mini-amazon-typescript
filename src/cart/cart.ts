import express, { Router } from 'express';
import { cartController } from './cartController';
import { Auth } from '../middleware/authMiddleware';
import { addCart, deleteCart, deleteCartDetails, getCart, updateCart } from '../validation/cartValidation';
import { queryValidate, schemaValidate } from '../middleware/schemaValidation';

export class cart {
	public router:Router;
	public auth: Auth;
	public cartController:cartController;
	constructor() {
		this.router = express.Router();
		this.auth = new Auth();
		this.cartController = new cartController();
		this.route();
	}
    
	route(): void {
		this.router.get('/getCart', [this.auth.authenticateToken,queryValidate(getCart)], this.cartController.getCart);

		this.router.post('/addCart',[this.auth.authenticateToken,schemaValidate(addCart)],this.cartController.addCart);
		
		this.router.put('/updateCart',[this.auth.authenticateToken,schemaValidate(updateCart)],this.cartController.updateCart);
        
		this.router.delete('/deleteCart',[this.auth.authenticateToken,queryValidate(deleteCart)],this.cartController.deleteCart);
        
		this.router.delete('/deleteCartDetails',[this.auth.authenticateToken,queryValidate(deleteCartDetails)],this.cartController.deleteCartDetails);
	}
}
