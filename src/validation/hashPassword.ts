import bcrypt from 'bcrypt';

export default class bcryptPassword {
	public bcryptPassword = async (password:string) => {
		const hashedPassword:string = await bcrypt.hash(password, 10);
		return hashedPassword;
	};
}
