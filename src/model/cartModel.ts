import mongoose, { Schema, model } from 'mongoose';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Cart extends mongoose.Document{
    buyerId:String,
    totalPrice: number,
	deletedAt:Date
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
	},
	deletedAt:{
		type:Date,
		default:null
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
cartModel.plugin(softDeletePlugin);
cartModel.pre('deleteOne',async function() {
	console.log('Deleted cart',this instanceof mongoose.Query);
});
const cartmodel = model<Cart,SoftDeleteModel<Cart>>('cart', cartModel);
cartmodel.deleteOne();
cartModel.path('buyerId').ref('user');
export default cartmodel;
