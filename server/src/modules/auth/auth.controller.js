import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { registerUser } from "./auth.service.js";

const register = asyncHandler(async(req,res , next)=>{
    const user = await registerUser(req.body);
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:user  
    })
})

export {register};