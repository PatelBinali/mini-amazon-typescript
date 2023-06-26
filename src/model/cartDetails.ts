import mongoose, { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface CartDetails {
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
},
{
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
}
);
cartDetails.plugin(softDeletePlugin);
const cartdetails = model<CartDetails>('cartdetails', cartDetails);
cartDetails.path('cartId').ref('cart');
cartDetails.path('productId').ref('product');
export default cartdetails;
