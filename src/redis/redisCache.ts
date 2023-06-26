import redisClients from './redisConfig';

const Redis = {
	getCache: async (_id:string) => {
		try {
			const cacheData = await redisClients.GET(`cacheData.${_id}`);
			console.log('cache get');
			return cacheData;
		}
		catch (err) {
			return err;
		}
	},

	setCache: async (_id:any,user:any) => {
		try {
			const cacheData = await redisClients.SET(`cacheData.${_id}`,JSON.stringify(user));
			console.log('cache set');
			return cacheData;
		}
		catch (err) {
			return err;
		}
	},

	deleteCache: async (_id:string) => {
		try {
			const cacheData = await redisClients.DEL(`cacheData.${_id}`);
			console.log('cache delete');
			return cacheData;
		}
		catch (err) {
			return err;
		}
	}
};
export default Redis;