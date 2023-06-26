import mongoose, { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Product {
	sellerId:String,
    productName: String,
    description: String,
    category: String,
    brand: String,
    price: number,
    stock: number,
}
const productModel = new Schema<Product>({
	sellerId: {
		type: mongoose.Schema.Types.ObjectId,
		required:true,
		ref:'user'
	},
	productName: {
		type: String,
		required:true
	},
	description: {
		type: String,
		required:true
	},
	category: {
		type: String,
		required:true
	},
	brand: {
		type: String,
		required:true
	},
	price: {
		type: Number,
		required:true
	},
	stock: {
		type: Number,
		required:true
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
productModel.plugin(softDeletePlugin);
const productmodel = model<Product>('product', productModel);
productModel.path('sellerId').ref('user');
export default productmodel;
