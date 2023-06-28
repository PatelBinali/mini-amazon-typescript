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
	
	public productList = async (searchTerm:any) => {
		try {
			// const url = 'mongodb://localhost:27017/userMongo';
			const p = productmodel.aggregate(
				[
					{
						$match: {
							// productName: `${searchTerm}`
							category: `${searchTerm}`
						}
					}
					// { $project: { price: `${searchTerm}` } }
				],
				{ maxTimeMS: 60000, allowDiskUse: true }
			);
			return p;
			
			// const limit:number = parseInt(pageSize);
			// const offset:number = (parseInt(page) - 1) * limit;
			// const result = await productmodel.find(
			// 	// [Op.or]: [
			// 	// 	{ productName: { [Op.like]: `%${searchTerm}%` } },
			// 	// 	{ category: { [Op.like]: `%${searchTerm}%` } },
			// 	// 	{ brand: { [Op.like]: `%${searchTerm}%` } },
			// 	// 	{ price: { [Op.like]: `%${searchTerm}%` } },
			// 	// 	{ description: { [Op.like]: `%${searchTerm}%` } }
			// 	// ],
			// 	// paranoid:false,
			// 	{ productName:{ $eq:searchTerm },
			// 		deletedAt:{ $eq:null } }
			// 	// limit,
			// 	// offset
			// 	// attributes: { exclude: ['createdAt','updatedAt','deletedAt'] }
			// );  
			// const totalPages = Math.ceil(result.count / limit);
			
			
			// return result;
			//  {
			// 	rows: 
			// count: result.count,
			// totalPages,
			// currentPage: parseInt(page)
			// };
		}
		catch (error) {
			throw error;
		}
	};

	public addProduct = async (productData:any) => {
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