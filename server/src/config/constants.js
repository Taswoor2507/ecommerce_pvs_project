import dotenv from "dotenv"
dotenv.config();
export const CONSTANTS = {
    PORT:process.env.PORT ,
    FRONTEND_URL:process.env.FRONTEND_URL,
    NODE_ENV:process.env.NODE_ENV,
    MONGO_URI:process.env.MONGO_URI,
    DB_NAME:process.env.DB_NAME,
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET
}