import mongoose, { Schema } from 'mongoose';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

interface User extends mongoose.Document{
	// _id:string,
    role:String,
    firstName: String,
    lastName: String,
    email: String,
    password: string,
    address: String,
    phoneNumber: String,
	// isDeleted:Boolean
	deletedAt:Date
}
const userModel = new Schema<User>({
	role: {
		type: String,
		required:true
	},
	firstName: {
		type: String,
		required:true
	},
	lastName: {
		type: String,
		required:true
	},
	email: {
		type: String,
		required:true,
		unique:true 
	},
	password: {
		type: String,
		required:true
	},
	address: {
		type: String,
		required:true
	},
	phoneNumber: {
		type: Number,
		required:true
	},
	// isDeleted:{
	// 	type:Boolean,
	// 	require:true,
	// 	default:false
	// },
	deletedAt:{
		type:Date,
		default:null
	}
},
{
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
userModel.plugin(softDeletePlugin);
userModel.pre('save',function(next) {
	next();
});
const usermodel = mongoose.model<User,SoftDeleteModel<User>>('user', userModel);
usermodel.deleteOne();
export default usermodel;