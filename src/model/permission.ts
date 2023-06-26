import { Schema, model } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
interface Permission {
    role:String,
    route: String,
	addPermission:String
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
	}
}, {
	versionKey: false,
	timestamps: { createdAt: true, updatedAt: true }
});
permissionModel.plugin(softDeletePlugin);
const permissionmodel = model<Permission>('permission', permissionModel);
export default permissionmodel;
