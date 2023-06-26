// import moment from 'moment';
// import Sequelize from 'sequelize';
// const Op = Sequelize.Op;
import fs from 'fs';
import usermodel from '../model/userModel';
import ordermodel from '../model/orderModel';


const userCron = async () => {
	const d:Date = new Date();
	
	const count:number = await usermodel.count();
	const counts:string = JSON.stringify(count);
	fs.appendFile('D:/mini-amazon-ts/src/userSpent/userSpent.txt',`\n\n ${d} \n Total users: ${counts}`,function(err) {
		if (err) throw err;
		console.log('Users saved');
	});

	// const deletedUser = await usermongo.count({ paranoid:false, where:{ deletedAt:{ [Op.not]:null } } });
	// const deletedUsers = JSON.stringify(deletedUser);
	// fs.appendFile('D:/mini-amazon-ts/src/userSpent/userSpent.txt',`\n\n ${d} \n Deleted users: ${deletedUsers}`,function(err) {
	// 	if (err) throw err;
	// 	console.log('Deleted users saved');
	// });

	const order = await ordermodel.find({
		// attributes:{ include:['buyerId','totalPrice','createdAt'],exclude:['orderId','updatedAt','deletedAt'] },
		// order:[['createdAt','DESC']],
		// where:{ 
		// createdAt:{
		// 	[Op.gt]:moment().subtract(7,'days').format('YYYY-MM-DD')
		// } 
	});
	const data = [];
	for (let i = 0;i < order.length;i++) {
		let arr = {
			buyerId:order[i].buyerId,
			totalPrice:order[i].totalPrice
			// createdAt:order[i].createdAt
		};
		data.push(arr);
	}
	const latestOrder:string = JSON.stringify(data,null,4);
	fs.appendFile('D:/mini-amazon-ts/src/userSpent/userSpent.txt',`\n\n ${d} \n users latest order and spents money 7 days ago: ${latestOrder}`,function(err) {
		if (err) throw err;
		console.log('Latest order and spent money 7days ago');
	});

	const user = await ordermodel.find({
		// attributes:{ include:['buyerId','totalPrice','createdAt'],exclude:['orderId','updatedAt','deletedAt'] },
		// order:[['createdAt','DESC']],
		// where:{ 
		// createdAt:{
		// 	[Op.gt]: moment().subtract(1, 'months').format('YYYY-MM-DD')
		// } 
		// }
	});
	const spentAmount = [];
	for (let i = 0;i < user.length;i++) {
		let array = {
			buyerId:user[i].buyerId,
			totalPrice:user[i].totalPrice
			// createdAt:user[i].createdAt
		};
		spentAmount.push(array);
	}
	const result = spentAmount;
	const str:string = JSON.stringify(result,null,4);
	fs.appendFile('D:/mini-amazon-ts/src/userSpent/userSpent.txt',`\n\n ${d}\n users latest order and spents money 1 month ago: ${str}`,function(err) {
		if (err) throw err;
		console.log('Latest order and spent money saved 1 month ago');
	});
};

export default userCron;

/* import { Op } from 'sequelize';
import moment from 'moment';
import fs from 'fs';

const user = await ordermongo.find({
  attributes: { include: ['buyerId', 'totalPrice', 'createdAt'], exclude: ['orderId', 'updatedAt', 'deletedAt'] },
  order: [['createdAt', 'DESC']],
  where: {
    createdAt: {
      [Op.gt]: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    },
  },
});

const spentAmount: { buyerId: string; totalPrice: number; createdAt: Date }[] = [];
for (let i = 0; i < user.length; i++) {
  const array = {
    buyerId: user[i].buyerId,
    totalPrice: user[i].totalPrice,
    createdAt: user[i].createdAt,
  };
  spentAmount.push(array);
}

const result = spentAmount;
const str = JSON.stringify(result, null, 4);
fs.appendFile('D:/mini-amazon-ts/src/userSpent/userSpent.txt', `\n\n ${d}\n users latest order and spents money 1 month ago: ${str}`, function (err) {
  if (err) throw err;
  console.log('Latest order and spent money saved 1 month ago');
});
*/