import { CONSTANTS } from "../../config/constants.js";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { generateAccessToken , generateRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Register user 
const registerUserService =  async (payload)=>{
    const { name, email, password } = payload;
    // check user exist or not
    const existingUser = await User.findOne({ email });
    if(existingUser){
        throw new ApiError(400 , "User already exists with this email");
    }
    // create new user 
    const user =  await User.create({name,email,password});
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
}

// login user
 const loginUserService = async (payload) => {
    const { email, password } = payload;

    // 1. Check user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 4. Store refresh token in DB 
    user.refreshToken = refreshToken;
    await user.save();

    // 5. Return clean user data 
    return {
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};


//refresh token
 const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError( 401 , "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, CONSTANTS.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError( 401 , "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.sub).select('+refreshToken');

  if (!user) {
    throw new ApiError( 404 , "User not found");
  }

  if (!user.refreshToken) {
    throw new ApiError( 401 , "User not logged in");
  }

  //  MATCH WITH DB 
  if (user.refreshToken !== refreshToken) {
    throw new ApiError( 403 , "Refresh token mismatch");
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  //  UPDATE refresh token 
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};



export {registerUserService , loginUserService, refreshTokenService};