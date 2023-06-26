import jwt from 'jsonwebtoken';
import jwtConfig from '../helper/constant';


export class jwtToken {
	static token = async (userData:any) => {
		const generateToken = {
			_id: userData._id,
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email
		};
		const accessToken:string = jwt.sign(generateToken, jwtConfig.JWT.SECRET, {
			expiresIn: jwtConfig.JWT.EXPIRES
		});
		const refreshToken:string = jwt.sign(generateToken,jwtConfig.JWT.SECRET);
		return { accessToken,refreshToken };
  
	};
}

