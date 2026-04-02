import { CONSTANTS } from "../../config/constants.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { loginUser, registerUser } from "./auth.service.js";

const register = asyncHandler(async(req,res , next)=>{
    const user = await registerUser(req.body);
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:user  
    })
})

 const login= asyncHandler(async (req, res) => {
    const isProduction = CONSTANTS.NODE_ENV === "production";
    const result = await loginUser(req.body);
    // Secure cookie 
        res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: result.user,
            accessToken: result.accessToken,
        }
    });
});


export {register ,  login};