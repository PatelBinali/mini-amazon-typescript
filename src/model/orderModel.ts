import mongoose, { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Order {
    buyerId:String,
    totalPrice: number
}
const orderModel = new Schema<Order>({
	buyerId: {
		type: mongoose.Schema.Types.ObjectId,
		onDelete:'cascade',
		ref:'user',
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
orderModel.plugin(softDeletePlugin);
const ordermodel = model<Order>('order', orderModel);
orderModel.path('buyerId').ref('user');
export default ordermodel;
