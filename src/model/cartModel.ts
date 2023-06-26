import mongoose, { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Cart {
    buyerId:String,
    totalPrice: number
}
const cartModel = new Schema<Cart>({
	buyerId: {
		type: mongoose.Schema.Types.ObjectId,
		onDelete:'cascade',
		ref:'user',
		required:true
	},
	totalPrice: {
		type: Number,
		default:0
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
cartModel.plugin(softDeletePlugin);
const cartmodel = model<Cart>('cart', cartModel);
cartModel.path('buyerId').ref('user');
export default cartmodel;
