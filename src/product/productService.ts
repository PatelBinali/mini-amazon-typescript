import { productData } from '../helper/routerInterface';
import productmodel from '../model/productModel';

// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;

class productService {
	public getProduct = async (query:any) => {
		try {
			return await productmodel.findOne(query);
		}
		catch (error) {
			throw error;
		}
	};
	public getProducts = async (query:any) => {
		try {
			return await productmodel.findOne(query).populate({ path:'sellerId',select:'_id firstName lastName email address phoneNumber ' });
		}
		catch (error) {
			throw error;
		}
	};
	
	public productList = async (searchTerm:any,price:any) => {
		try {
			const cost = parseInt(price);
			// const result = await productmodel.find({ 
			// 	$or:[
			// 		{ productName:{ $regex: `${searchTerm}`,$options:'i' } },
			// 		{ category:{ $regex: `${searchTerm}`,$options:'i' } },
			// 		{ brand:{ $regex: `${searchTerm}`,$options:'i' } },
			// 		{ description:{ $regex: `${searchTerm}`,$options:'i' } }
			// 		// { price:{ $regex: `${searchTerm}` ,$options:'/^[0-9]+$/' } }
			// 	] 
			// });
			const result = productmodel.aggregate(
				[
					{
						$match: { $or:[
							{ productName: { $regex:`${searchTerm}`,$options:'i' } },
							{ category:{ $regex: `${searchTerm}`,$options:'i' } },
							{ brand:{ $regex: `${searchTerm}`,$options:'i' } },
							{ description:{ $regex: `${searchTerm}`,$options:'i' } }
						],
						$expr:{ $gt:[{ $getField:'price' },cost] } 
						}
					}
					// { $limit:1 }
					// { $project: { price: `${searchTerm}` } }
				],
				{ maxTimeMS: 60000, allowDiskUse: true }
			);
			return result;
		}
		catch (error) {
			throw error;
		}
	};

	public addProduct = async (productData:productData) => {
		try {
			return await productmodel.create(productData);
		}
		catch (error) {
			throw error;
		}
	};

	public updateProduct = async (update:any,query:any) => {
		try {
			return await productmodel.updateOne(update,query);
		}
		catch (error) {
			throw error;
		}
	};

	public deleteProduct = async (query:any) => {
		try {
			return await productmodel.softDelete(query);
		}
		catch (error) {
			throw error;
		}
	};
}

export { productService };