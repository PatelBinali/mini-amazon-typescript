import joi from 'joi';
const signUp = joi.object().keys({
	role: joi.string().valid('admin','buyer','seller').required(),
	firstName: joi.string().required(),
	lastName: joi.string().required(),
	email: joi.string().email().required(), 
	password: joi.string().min(6).required(),
	address: joi.string().required(), 
	phoneNumber: joi.number().required(),
	confirmPassword: joi.string().min(6).valid(joi.ref('password')).required()
});  

const update = joi.object().keys({
	_id:joi.string().required(),
	role: joi.string().valid('admin','buyer','seller').required(),
	firstName: joi.string(),
	lastName: joi.string(),
	email: joi.string().email(), 
	password: joi.string().min(6),
	address: joi.string(), 
	phoneNumber: joi.number(),
	confirmPassword: joi.string().min(6).valid(joi.ref('password'))
});  

const login = joi.object().keys({
	email: joi.string().email().required(), 
	password: joi.string().min(6).required()
});

const getUser = joi.object().keys({
	_id:joi.string().required()
});

const deleteUser = joi.object().keys({
	_id:joi.string().required()
});

const addPermission = joi.object().keys({
	role:joi.string().required(),
	route:joi.string().required(),
	addPermission:joi.string().required()
});

const deletePermission = joi.object().keys({
	_id:joi.string().required()
});
export { signUp,update,login,getUser,deleteUser,addPermission,deletePermission };
