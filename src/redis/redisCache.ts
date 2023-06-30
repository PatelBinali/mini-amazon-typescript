import Redis from 'ioredis';


const redisClient = new Redis();
const redis = {
	getCache: async (_id:string) => {
		try {
			const cacheData = await redisClient.get(`cacheData.${_id}`);
			console.log('cache get');
			return cacheData;
		}
		catch (err) {
			return err;
		}
	},

	setCache: async (_id:any,user:any) => {
		try {
			const cacheData = await redisClient.set(`cacheData.${_id}`,JSON.stringify(user));
			console.log('cache set');
			return cacheData;
		}
		catch (err) {
			return err;
		}
	},

	deleteCache: async (_id:string) => {
		try {
			const cacheData = await redisClient.del(`cacheData.${_id}`);
			console.log('cache delete');
			return cacheData;
		}
		catch (err) {
			return err;
		}
	}
};
export default redis;