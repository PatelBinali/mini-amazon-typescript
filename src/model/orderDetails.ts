import mongoose, { Schema, model } from 'mongoose';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface OrderDetails extends mongoose.Document {
	orderId:String,
    productId: String,
    price: number,
    quantity: number,
    totalPrice: number,
	deletedAt:Date
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
	},
	deletedAt:{
		type:Date,
		default:null
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
orderDetails.plugin(softDeletePlugin);
orderDetails.pre('deleteOne',async function() {
	console.log('Deleted orderdetails',this instanceof mongoose.Query);
});
const orderdetails = model<OrderDetails,SoftDeleteModel<OrderDetails>>('orderdetails', orderDetails);
orderdetails.deleteOne();
orderDetails.path('productId').ref('product');
orderDetails.path('orderId').ref('order');
export default orderdetails;
