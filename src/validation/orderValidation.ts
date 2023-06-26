import joi from 'joi';

const cancleOrder = joi.object().keys({
	_id:joi.string().required()
});

const cancleOrderDetails = joi.object().keys({
	_id:joi.string().required()
});

const placeOrder = joi.object().keys({
	buyerId:joi.string().required()
});

const getOrder = joi.object().keys({
	orderId:joi.string().required()
});

export { cancleOrder,cancleOrderDetails,placeOrder,getOrder };