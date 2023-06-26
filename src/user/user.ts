import express,{ Router } from 'express';
import { userController } from './userController';
import { Auth } from '../middleware/authMiddleware';
import { schemaValidate, queryValidate } from '../middleware/schemaValidation';
import { addPermission, deletePermission, deleteUser, getUser, login, signUp, update } from '../validation/userValidation';

export class user {
	public router:Router;
	public auth: Auth;
	public userController:userController;
	constructor() {
		this.router = express.Router();
		this.auth = new Auth();
		this.userController = new userController();
		this.route();
	}
    
	route():void {
		
		this.router.get('/getUser',[this.auth.authenticateToken,queryValidate(getUser)], this.userController.getUser);
        
		this.router.get('/userList', this.auth.authenticateToken, this.userController.userList);
        
		this.router.post('/login',schemaValidate(login) ,this.userController.login);
        
		this.router.post('/adminSignUp',schemaValidate(signUp) ,this.userController.adminSignUp);
        
		this.router.post('/userSignUp',schemaValidate(signUp) ,this.userController.userSignUp);
        
		this.router.get('/permissionList', this.auth.authenticateToken, this.userController.permissionList);
        
		this.router.post('/addPermission',[this.auth.authenticateToken,schemaValidate(addPermission)], this.userController.addPermission);
        
		this.router.delete('/deletePermission', [this.auth.authenticateToken,queryValidate(deletePermission)], this.userController.deletePermission);
        
		this.router.put('/updateUser', [this.auth.authenticateToken,schemaValidate(update)], this.userController.updateUser);
        
		this.router.delete('/deleteUser', [this.auth.authenticateToken,queryValidate(deleteUser)], this.userController.deleteUser);
        
		this.router.post('/logout', this.auth.authenticateToken, this.userController.logout);
	}
}
