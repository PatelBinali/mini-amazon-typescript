// import { Op } from 'sequelize';
import fs from 'fs';
import moment from 'moment';
import productmodel from '../model/productModel';

const productCron = async () => {
	const d:Date = new Date();
	const productCount:number = await productmodel.count();
	let totalPrdouct:string = JSON.stringify(productCount);
	fs.appendFile('D:/mini-amazon-ts/src/productCron/productAdd.txt',`\n\n ${d} \n Total Products: ${totalPrdouct}`,function(err) {
		if (err) throw err;
		console.log('Total Product saved');
	});


	// const deletedProduct = await productmongo.count({ deletedAt:{ [Op.not]:null } });
	// const deletedProducts = JSON.stringify(deletedProduct);
	// fs.appendFile('D:/mini-amazon-ts/src/productCron/productAdd.txt',`\n\n ${d} \n Deleted products: ${deletedProducts}`,function(err) {
	// 	if (err) throw err;
	// 	console.log('Deleted product saved');
	// });


	// const product = await productmongo.find({
	// 	attributes:{ include:['productId','sellerId','createdAt'],exclude:['productName','description','category','brand','price','stock'] },
	// 	product:[['createdAt','DESC']],
	// 	createdAt:{
	// 		[Op.gt]:moment().subtract(7,'days').format('YYYY-MM-DD')
	// 	}
	// });
	// const data = [];
	// for (let i = 0;i < product.length;i++) {
	// 	let arr = {
	// 		productId:product[i]._id,
	// 		sellerId:product[i].sellerId
	// 		// createdAt:product[i].createdAt
	// 	};
	// 	data.push(arr);
	// }
	// const latestProduct = JSON.stringify(data,null,4);
	// fs.appendFile('D:/mini-amazon-ts/src/productCron/productAdd.txt',`\n\n ${d} \n users latest product of 7 days ago: ${latestProduct}`,function(err) {
	// 	if (err) throw err;
	// 	console.log('Latest product of 7days ago');
	// });


	const productList = await productmodel.find({
		// attributes:{ include:['productId','sellerId','createdAt'],exclude:['productName','description','category','brand','price','stock'] },
		
		'sellerId':{
			$gte:moment().subtract(0,'days').format('YYYY-MM-DD')
		} 
	});
	const array = [];
	for (let i = 0;i < productList.length;i++) {
		let arr = {
			_id:productList[i]._id,
			sellerId:productList[i].sellerId
			// createdAt:productList[i].createdAt
		};
		array.push(arr);
	}
	const monthProduct:string = JSON.stringify(array,null,4);
	fs.appendFile('D:/mini-amazon-ts/src/productCron/productAdd.txt',`\n\n ${d} \n users latest product of 1 day ago: ${monthProduct}`,function(err) {
		if (err) throw err;
		console.log('Latest product of 1 month ago');
	});
};

export default productCron;