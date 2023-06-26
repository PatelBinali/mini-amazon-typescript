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
			return await ordermodel.deleteOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public orderDetails = async (orderDetails:any) => {
		try {
			return await orderDetails.create(orderDetails);
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
			return await orderDetails.deleteOne(query);
		}
		catch (error) {
			throw error;
		}
	};
}
export { orderService };