import mongoose, { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface OrderDetails {
	orderId:String,
    productId: String,
    price: number,
    quantity: number,
    totalPrice: number
}
const orderDetails = new Schema<OrderDetails>({
	orderId: {
		type: mongoose.Schema.Types.ObjectId,
		onDelete:'cascade',
		ref:'order',
		required:true
	},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		onDelete:'cascade',
		ref:'product',
		required:true
	},
	price: {
		type: Number,
		required:true
	},
	quantity: {
		type: Number,
		required:true
	},
	totalPrice: {
		type: Number,
		required:true
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
orderDetails.plugin(softDeletePlugin);
const orderdetails = model<OrderDetails>('orderdetails', orderDetails);
orderDetails.path('productId').ref('product');
orderDetails.path('orderId').ref('order');
export default orderdetails;
