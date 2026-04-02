import User from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { generateAccessToken , generateRefreshToken } from "../../utils/jwt.js";
import bcrypt from "bcryptjs";
// Register user 
const registerUser =  async (payload)=>{
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
 const loginUser = async (payload) => {
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
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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


export {registerUser , loginUser};