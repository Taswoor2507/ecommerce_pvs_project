import User from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";

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

export {registerUser};