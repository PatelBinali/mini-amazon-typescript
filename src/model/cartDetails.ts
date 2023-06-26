import mongoose, { Schema, model } from 'mongoose';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface CartDetails extends mongoose.Document{
	cartId:String,
    productId: String,
    price: number,
    quantity: number,
    totalPrice: number
}
const cartDetails = new Schema<CartDetails>({
	cartId: {
		type: mongoose.Schema.Types.ObjectId,
		onDelete:'cascade',
		ref:'cart',
		required:true,
		isDeleted:{ type: Boolean, defaults: false }
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
},
{
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
}
);
cartDetails.plugin(softDeletePlugin);
cartDetails.pre('deleteOne',async function() {
	console.log('Deleted cartdetails',this instanceof mongoose.Query);
});
const cartdetails = model<CartDetails,SoftDeleteModel<CartDetails>>('cartdetails', cartDetails);
cartdetails.deleteOne();
cartDetails.path('cartId').ref('cart');
cartDetails.path('productId').ref('product');
export default cartdetails;
