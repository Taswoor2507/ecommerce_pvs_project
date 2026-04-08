import jwt from "jsonwebtoken";
import { CONSTANTS } from "../config/constants.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    } else {
        throw new ApiError(401, "Not authorized to access this route. Missing or invalid token format.");
    }

    try {
        const decoded = jwt.verify(token, CONSTANTS.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.sub);

        if (!user) {
            throw new ApiError(401, "The user belonging to this token no longer exists.");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Not authorized, token failed or expired.");
    }
});

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `User role '${req.user.role}' is not authorized to access this route.`);
        }
        next();
    };
};
