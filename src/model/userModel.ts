import { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

interface User {
    role:String,
    firstName: String,
    lastName: String,
    email: String,
    password: string,
    address: String,
    phoneNumber: String,
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
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
userModel.plugin(softDeletePlugin);
const usermodel = model<User>('user', userModel);
export default usermodel;
