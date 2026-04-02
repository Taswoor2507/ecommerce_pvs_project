import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CONSTANTS } from './config/constants.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './modules/auth/auth.route.js';

const app = express();
// CORS
const allowedOrigin = CONSTANTS.FRONTEND_URL || '*';
const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Built-in middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ limit: '20kb', extended: true }));

// Cookie parser
app.use(cookieParser());

// Module Routes 
app.use("/api/v1/auth" , authRouter);
//error middleware
app.use(errorHandler);

export default app;