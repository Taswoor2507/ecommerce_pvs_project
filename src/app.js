import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CONSTANTS } from './constants.js';

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



export default app;