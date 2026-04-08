import { CONSTANTS } from "../../config/constants.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { loginUserService, registerUserService, refreshTokenService, logoutUserService, getMeService } from "./auth.service.js";

const register = asyncHandler(async(req,res , next)=>{
    const user = await registerUserService(req.body);
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        data:user  
    })
})

 const login= asyncHandler(async (req, res) => {
    const isProduction = CONSTANTS.NODE_ENV === "production";
    const result = await loginUserService(req.body);
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

// refresh token controller
  const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(refreshToken);

  //  set refresh token in cookies 
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: CONSTANTS.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Token refreshed",
    data: {
      accessToken, 
    },
  });
});


// Logout controller
const logout = asyncHandler(async (req, res) => {
    // Also remove from DB
    await logoutUserService(req.user._id);

    // Clear cookie
    res.cookie("refreshToken", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: CONSTANTS.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
        data: {}
    });
});

// Get current user controller
const getMe = asyncHandler(async (req, res) => {
    const user = await getMeService(req.user._id);
    
    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user
    });
});

export {register, login, refreshToken, logout, getMe};