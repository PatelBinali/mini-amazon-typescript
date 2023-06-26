import { Express, Response, Request } from 'express';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtToken } from './validation/jwtToken';
import swaggerJsdoc from './swagger.json';
import swaggerUi from 'swagger-ui-express';
import cron from 'node-cron';
import PORT from './helper/constant';
// import userCron from './cronjob/userCron';
// import productCron from './cronjob/productCron';
import connect from './model/service';
import { Routes } from './router/index';
connect.connect();
// const port:number = 4000;

const app:Express = express();

const route = new Routes();

app.use(express.json());

app.use('/api',route.router);

app.get('/', (req:Request, res:Response) => {
	res.send('Invalid Route');
});

app.get('/ping', (req:Request, res:Response) => {
	res.send('Pong');
});

cron.schedule('0 */1 * * *', async () => {
	// userCron();
	// productCron();
});

app.post('/refresh', (req, res) => {
	if (req.cookies) {

		// Destructuring refreshToken from cookie
		const refreshToken = req.cookies;
		console.log(refreshToken);

		// Verifying refresh token
		jwt.verify(refreshToken,'it-is-secret',
			(error:any) => {
				if (error) {

					// Wrong Refesh Token
					return res.status(406).json({ message: 'Unauthorized' });
				}
				else {
					// Correct token we send a new access token
					const accessToken = jwtToken.token(refreshToken);
					return res.json({ accessToken });
				}
			});
	}
	else {
		return res.status(406).json({ message: 'Unauthorizedd' });
	}
});

app.use('*/swagger',	swaggerUi.serve, swaggerUi.setup(swaggerJsdoc)
);

app.listen(PORT.PORT, () => {
	console.log(`Express Server Running on → port ${PORT.PORT}`);
});