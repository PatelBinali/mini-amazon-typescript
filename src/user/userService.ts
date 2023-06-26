// import db from '../model/config';
import permissionmodel from '../model/permission';
import usermodel from '../model/userModel';

class userService {
	public getUser = async (query:any) => {
		try {
			return await usermodel.findOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public userList = async () => {
		try {
			return await usermodel.find(
				// 	{ 
				// 	paranoid:false,
				// 	attributes: { exclude: ['password','createdAt','updatedAt','deletedAt'] } 
				// }
			);
		}
		catch (error) {
			throw error;
		}
	};

	public userSignUp = async (user:any) => {
		try {
			return await usermodel.create(user);
		}
		catch (error) {
			throw error;
		}
	};

	public updateUser = async (update:any,query:any) => {
		try {
			return await usermodel.updateOne(update,query);
		}
		catch (error) {
			throw error;
		}
	};

	public deleteUser = async (query:any) => {
		try {
			return await usermodel.deleteOne(query);
		}
		catch (error) {
			throw error;
		}
	};

	public addPermission = async (addPermission:any) => {
		try {
			return await permissionmodel.create(addPermission);
		}
		catch (error) {
			throw error;
		}
	};

	public permissionList = async () => {
		try {
			return await permissionmodel.find();
		}
		catch (error) {
			throw error;
		}
	};

	public getPermission = async (permissionId:any) => {
		try {
			return await permissionmodel.findOne({ permissionId });
		}
		catch (error) {
			throw error;
		}
	};

	public deletePermission = async (query:any) => {
		try {
			return await permissionmodel.deleteOne(query);
		}
		catch (error) {
			throw error;
		}
	};
}

export { userService };
