import mongoose, { Schema, model } from 'mongoose';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Permission extends mongoose.Document {
    role:String,
    route: String,
	addPermission:String,
	deletedAt:Date
}
const permissionModel = new Schema<Permission>({
	role: {
		type: String,
		required:true
	},
	route: {
		type: String,
		required:true
	},
	addPermission: {
		type: String,
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
permissionModel.plugin(softDeletePlugin);
permissionModel.pre('deleteOne',async function() {
	console.log('Deleted permission', this instanceof mongoose.Query);
});
const permissionmodel = model<Permission,SoftDeleteModel<Permission>>('permission', permissionModel);
permissionmodel.deleteOne();
export default permissionmodel;
