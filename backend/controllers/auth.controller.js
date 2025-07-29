import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateToken } from "../controllers/user.controller.js";



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, at least one letter and one number

// ===============================login admin=================================
// This function handles the login of an admin user. It checks if the user exists, verifies the password, and generates JWT tokens for authentication.
// If the login is successful, it sends the tokens and user information in the response. If there are any errors, it throws an ApiError with the appropriate message and status code.

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // =========================================validation===================================

  if (!email || !password) {
    throw new apiErrors(400, "All fields are required");
  }

  if (!email.trim() || !password.trim()) {
    throw new apiErrors(400, "All fields are required");
  } else if (!emailRegex.test(email)) {
    throw new apiErrors(400, "Email is not valid");
  } else if (!passwordRegex.test(password)) {
    throw new apiErrors(
      400,
      "Password must be at least 8 characters long and contain at least one letter and one number"
    );
  }
  // =========================================Check if the user exists in the database=================

  const existingUser = await User.findOne({ email: email.trim() }).select(
    "+password +refreshToken +role"
  );
  if (!existingUser) {
    throw new apiErrors(400, "Invalid email or password");
  }

  
  // =========================================Check if the password is correct=================
  console.log("Entered password:", password);

  const isPasswordCorrect = await existingUser.comparePassword(password.trim());
  if (!isPasswordCorrect) {
    throw new apiErrors(400, "Invalid email or password");
  }

  //  ==========================================Check if the user is an admin=================
  const isAdmin = existingUser.role === "admin";
  if (!isAdmin) {
    throw new apiErrors(403, "You are not authorized to access this route");
  }
  // =========================================Generate a refresh token=================

  const { accessToken, refreshToken } = await generateToken(existingUser._id);

  // ===================================== making user reference to the refresh token=================

  const loggedInAdmin = await User.findById(existingUser._id).select(
    "-password -refreshToken"
  );

  // ==========================send in cookies=========================================

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
      status: "success",
      user: loggedInAdmin,
      accessToken,
      refreshToken,
      message: "Admin logged in successfully",
    });
});

// ===============================logout admin=================================

const logout = asyncHandler(async (req, res) => {
await User.findByIdAndUpdate(
  req.user._id,
  { refreshToken: null },
  { new: true }
);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

   return res
    .status(200)
    .clearCookie("refreshToken", null, cookieOptions)
    .clearCookie("accessToken", null, cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { login, logout };

  



