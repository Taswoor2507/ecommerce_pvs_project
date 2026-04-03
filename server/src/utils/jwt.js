import jwt from "jsonwebtoken";
import { CONSTANTS } from "../config/constants.js";

// Secrets from env
const ACCESS_TOKEN_SECRET = CONSTANTS.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = CONSTANTS.REFRESH_TOKEN_SECRET;

// Generate Access Token
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { sub: userId }, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: "15m" }
    );
};

// Generate Refresh Token
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { sub: userId }, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: "7d" }
    );
};