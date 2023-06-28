import { ObjectId } from 'mongodb';
import orderDetails from '../model/orderDetails';
import ordermodel from '../model/orderModel';

class orderService {
	public getOrder = async (_id:any) => {
		try {
			return await ordermodel.findById(_id,{ _id });
		}
		catch (error) {
			throw error;
		}
	};

	public getAllOrder = async () => {
		try {
			return await ordermodel.find(
				// 	{
				// 	include: [{ model: db.orderDetails }]
				// }
			);
		}
		catch (error) {
			throw error;
		}
	};

	public placeOrder = async (placeOrder:any) => {
		try {
			return await ordermodel.create(placeOrder);
		}
		catch (error) {
			throw error;
		}
	};

	public updateOrder = async (query:any,updated:any) => {
		try {
			const total = await ordermodel.updateOne(query,updated);
			return total;
		}
		catch (error) {
			throw error;
		}
	};

	public order = async (query:any) => {
		try {
			return await ordermodel.findOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public orderDetailsPlaced = async (query:any) => {
		try {
			return await ordermodel.findOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public cancleOrder = async (query:any) => {
		try {
			return await ordermodel.softDelete(query);
		}
		catch (error) {
			throw error;
		}
	};

	public orderDetail = async (orderDetail:any) => {
		try {
			return await orderDetails.create(orderDetail);
		}
		catch (error) {
			throw error;
		}
	};

	public getOrderDetailsById = async (query:any) => {
		try {
			return await orderDetails.find(query);
		}
		catch (error) {
			throw error;
		}
	};

	public cancleOrderDetails = async (query:any) => {
		try {
			return await orderDetails.softDelete(query);
		}
		catch (error) {
			throw error;
		}
	};

	public getAllDetails = async (orderId:any) => {
		try {
			const result = orderDetails.aggregate(
				[
					{
						$match: {
							orderId: new ObjectId(`${orderId}`)
						}
					},
					{
						$lookup: {
							from: 'products',
							localField: 'productId',
							foreignField: '_id',
							as: 'productData'
						}
					},
					{
						$lookup: {
							from: 'users',
							localField: 'productData.sellerId',
							foreignField: '_id',
							as: 'sellerData'
						}
					},
					{
						$project: {
							_id: 1,
							orderId: 1,
							productId: 1,
							price: 1,
							quantity: 1,
							totalPrice: 1,
							productData: {
								productName: 2,
								description: 2,
								category: 2,
								brand: 2
							},
							sellerData: { firstName: 3, lastName: 3 }
						}
					}					
				],
				{ maxTimeMS: 60000, allowDiskUse: true }
			);
			return result;
		}
		catch (error) {
			throw error;
		}
	};
}
export { orderService };