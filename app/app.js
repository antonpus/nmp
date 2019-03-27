import express from 'express';
import initdb from '../db/mongodb/initdb';
import cookieParser from 'cookie-parser';

import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';

import apiRouter from './routes/api';
import authRouter from './routes/auth';

const app = express();
initdb();

app.use(cookieParser(), customCookieParser, customQueryParser, express.json());
app.use('/api', apiRouter);
app.use('/auth', authRouter);

export default app;