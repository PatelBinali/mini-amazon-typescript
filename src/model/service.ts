import mongoose from 'mongoose';
import { Redis } from 'ioredis';
mongoose.Promise = global.Promise;
const dbUrl = 'mongodb://localhost:27017/userMongo';
const connect = async () => {
	mongoose.connect(dbUrl);
	const db = mongoose.connection;
	db.on('error', () => {
		console.log('D B - E R R O R');
	});
	db.once('open', () => {
		console.log('D B - C O N N E C T E D');
	});
};

const redisClient:Redis = new Redis();
redisClient.on('connect',() => {
	console.log('Redis Connected');
	
});

redisClient.on('error',(err: any) => {
	console.log('Redis Error',err);
	
});
export default { connect,redisClient };


