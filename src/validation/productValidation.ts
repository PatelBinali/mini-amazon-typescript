import joi from 'joi';

const addProduct = joi.object({
	productName: joi.string().required(),
	description: joi.string().required(), 
	category: joi.string().required(),
	brand: joi.string().required(), 
	price: joi.number().min(1).required(), 
	stock: joi.number().min(1).required()
});  

const updateProduct = joi.object({
	_id:joi.string().required(),
	sellerId:joi.string(),
	productName: joi.string(),
	description: joi.string(), 
	category: joi.string(),
	brand: joi.string(), 
	price: joi.number().min(1), 
	stock: joi.number().min(1)
});  

const deleteProduct = joi.object({
	_id:joi.string().required()
});  

const getProduct = joi.object({
	_id:joi.string().required()
}); 

const query = joi.object().keys({
	searchTerm: joi.string(),
	// page:joi.number().min(1),
	// pageSize: joi.number().min(1)
	price:joi.number() 
});  

export { getProduct,addProduct,updateProduct,deleteProduct,query };

