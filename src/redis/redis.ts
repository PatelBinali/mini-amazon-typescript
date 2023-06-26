import redisClient from './redisConfig';

async () => {
	if (await redisClient.connect) {

		console.log('hi');
	}
	else {
		console.error('Redis client is not connected');
	}
}; 