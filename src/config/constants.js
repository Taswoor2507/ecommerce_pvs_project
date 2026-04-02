import dotenv from "dotenv"
dotenv.config();
export const CONSTANTS = {
    PORT:process.env.PORT ,
    FRONTEND_URL:process.env.FRONTEND_URL
}