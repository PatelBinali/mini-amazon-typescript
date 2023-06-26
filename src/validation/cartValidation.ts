import joi from 'joi';

const getCart = joi.object().keys({
	_id: joi.string().required()
});  

const addCart = joi.object().keys({
	buyerId:joi.string().required(),
	productId:joi.string().required(),
	quantity:joi.number().required(),
	totalPrice:joi.number()
});

const updateCart = joi.object().keys({
	cartId:joi.string().required(),
	productId:joi.string().required(),
	quantity:joi.number().required()
});

const deleteCart = joi.object().keys({
	_id: joi.string().required()
}); 

const deleteCartDetails = joi.object().keys({
	_id: joi.string().required()
}); 
export { getCart,addCart,updateCart,deleteCart,deleteCartDetails };		