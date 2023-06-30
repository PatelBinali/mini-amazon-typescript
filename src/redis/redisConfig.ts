import redis from 'redis';

const redisClient = redis.createClient();

redisClient.on('connect',function() {
	console.log('redis connected.');
	
});
redisClient.connect();
export default redisClient;
