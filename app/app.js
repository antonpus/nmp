import express from 'express';
import cookieParser from 'cookie-parser';

import customCookieParser from './middlewares/customCookieParser';
import customQueryParser from './middlewares/customQueryParser';
import authChecker from './middlewares/authChecker';

import apiRouter from './routes/api';
import authRouter from './routes/auth';

const app = express();

app.use(cookieParser(), customCookieParser, customQueryParser, express.json());
app.use('/api', authChecker, apiRouter);
app.use('/auth', authRouter);

export default app;