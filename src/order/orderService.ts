import { ObjectId } from 'mongodb';
import orderDetails from '../model/orderDetails';
import ordermodel from '../model/orderModel';
import { cartTotalPrice, deleteUser, order } from '../helper/routerInterface';

class orderService {

	public placeOrder = async (placeOrder:order) => {
		try {
			return await ordermodel.create(placeOrder);
		}
		catch (error) {
			throw error;
		}
	};

	public updateOrder = async (query:deleteUser,updated:cartTotalPrice) => {
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
			const result = orderDetails.aggregate(
				[
					{
						$match: {
							orderId:new ObjectId(`${query}`)
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

	public cancleOrderDetails = async (query:any) => {
		try {
			return await orderDetails.softDelete(query);
		}
		catch (error) {
			throw error;
		}
	};
}
export { orderService };