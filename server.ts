import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config()
const app: Express = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
import apiRoutes from './api';
app.use('/api', apiRoutes)

app.listen(port, () => console.log('[server]: Server is running at http://localhost:'+port));
