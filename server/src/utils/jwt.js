import jwt from "jsonwebtoken";
import { CONSTANTS } from "../config/constants.js";

// Secrets from env
const ACCESS_TOKEN_SECRET = CONSTANTS.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = CONSTANTS.REFRESH_TOKEN_SECRET;

// Generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email }, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: "15m" }
    );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email }, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: "7d" }
    );
};