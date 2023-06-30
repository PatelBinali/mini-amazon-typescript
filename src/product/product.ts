import express, { Router } from 'express';
import { productController } from './productController';
import { addProduct, deleteProduct, getProduct, query, updateProduct } from '../validation/productValidation';
import { Auth } from '../middleware/authMiddleware';
import { queryValidate, schemaValidate } from '../middleware/schemaValidation';


export class product {
	public router:Router;
	public auth: Auth;
	public productController:productController;
	constructor() {
		this.router = express.Router();
		this.auth = new Auth();
		this.productController = new productController();
		this.route();
	}
    
	route(): void {
		this.router.get('/getProduct',[this.auth.authenticateToken,queryValidate(getProduct)],this.productController.getProduct);
        
		this.router.get('/productList',[this.auth.authenticateToken,queryValidate(query)],this.productController.productList);
        
		this.router.post('/addProduct',[this.auth.authenticateToken,schemaValidate(addProduct)],this.productController.addProduct);
        
		this.router.put('/updateProduct',[this.auth.authenticateToken,schemaValidate(updateProduct)],this.productController.updateProduct);
        
		this.router.delete('/deleteProduct',[this.auth.authenticateToken,queryValidate(deleteProduct)],this.productController.deleteProduct);
		
	}
}

