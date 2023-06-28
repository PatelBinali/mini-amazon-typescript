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
	public userList = async (searchTerm:any) => {
		try {
			const result = usermodel.aggregate(
				[
					{
						$match: { $or:[
							{ firstName:{ $regex:`${searchTerm}`,$options:'i' } },
							{ lastName:{ $regex: `${searchTerm}`,$options:'i' } },
							{ address:{ $regex: `${searchTerm}`,$options:'i' } },
							{ role:{ $regex: `${searchTerm}`,$options:'i' } },
							{ email:{ $regex: `${searchTerm}`,$options:'i' } }
						] }
					}
					// { $limit:1 }
				],
				{ maxTimeMS: 60000, allowDiskUse: true }
			);
			return result;
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
			return await usermodel.softDelete(query);
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
			return await permissionmodel.softDelete(query);
		}
		catch (error) {
			throw error;
		}
	};
}

export { userService };
