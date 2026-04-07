import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CONSTANTS } from './config/constants.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './modules/auth/auth.route.js';
import { productRouter } from './modules/product/product.route.js';
import variantRouter from './modules/Variant/variant.route.js';
import { combinationRouter } from './modules/combinations/combination.route.js';
import { orderRouter } from './modules/order/order.route.js';

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
// auth router
app.use("/api/v1/auth" , authRouter);
// product router
app.use("/api/v1/products" , productRouter); 
//variant router
app.use("/api/v1/products" , variantRouter);
//combination router
app.use("/api/v1/products" , combinationRouter)


// order router
app.use("/api/v1/orders" , orderRouter)
//error middleware
app.use(errorHandler);

export default app;