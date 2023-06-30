// import db from '../model/config';
import cartmodel from '../model/cartModel';
import cartDetails from '../model/cartDetails';
import { Details, carts, cartTotalPrice, updateCart, updatecartId } from '../helper/routerInterface';

class cartService {
	public getCart = async (query:any) => {
		try {
			return await cartmodel.findOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public getCartDetails = async (query:any) => {
		try {
			return await cartDetails.find(query);
		}
		catch (error) {
			throw error;
		}
	};

	public getCartDetail = async (query:any) => {
		try {
			return await cartDetails.findOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public addCart = async (query:carts) => {
		try {
			return await cartmodel.create(query);
		}
		catch (error) {
			throw error;
		}
	};

	public addCartDetails = async (query:Details) => {
		try {
			return await cartDetails.create(query);
		}
		catch (error) {
			throw error;
		}
	};

	public updateCart = async (updated:updatecartId,query:cartTotalPrice) => {
		try {
			return await cartmodel.updateOne(updated,query);
		}
		catch (error) {
			throw error;
		}
	};

	public updateCartDetails = async (updated:updateCart,query:any) => {
		try {
			return await cartDetails.updateOne(updated,query);
		}
		catch (error) {
			throw error;
		}
	};

	public deleteCart = async (query:any) => {
		try {
			return await cartmodel.deleteOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public deleteCartDetails = async (query:any) => {
		try {
			return await cartDetails.deleteOne(query);
		}
		catch (error) {
			throw error;
		}
	};
}

export { cartService };