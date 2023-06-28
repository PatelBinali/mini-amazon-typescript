import mongoose, { Schema, model } from 'mongoose';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Order extends mongoose.Document{
    buyerId:String,
    totalPrice: number,
	deletedAt:Date
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
	},
	deletedAt:{
		type:Date,
		default:null
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
orderModel.plugin(softDeletePlugin);
orderModel.pre('deleteOne',async function() {
	console.log('Deleted order',this instanceof mongoose.Query);
});
const ordermodel = model<Order,SoftDeleteModel<Order>>('order', orderModel);
ordermodel.deleteOne();
orderModel.path('buyerId').ref('user');
export default ordermodel;
