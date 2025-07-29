import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, at least one letter and one number

// =============================register user=========================================================
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, interests } = req.body;

  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  // ==========================================validation===================================

  if (!username.trim() || !email.trim() || !password.trim()) {
    throw new apiErrors(400, "All fields are required");
  } else if (username.length < 6) {
    throw new apiErrors(400, "Username must be at least 6 characters long");
  } else if (!emailRegex.test(email)) {
    throw new apiErrors(400, "Email is not valid");
  } else if (!passwordRegex.test(password)) {
    throw new apiErrors(
      400,
      "Password must be at least 8 characters long and contain at least one letter and one number"
    );
  }
 
  // =========================================== Check if the email already exists in the database=================

  const existingUser = await User.findOne({ email: email.trim() });
  if (existingUser) {
     return res.status(400).json({ message: "User already exists" });
  }
  // =====================================image upload=============================================================

 let imagePath;
if (req.file) {
  imagePath = `/uploads/${req.file.originalname}`;
} else {
  imagePath = "/uploads/blankprofile.png"; 
}


  // ====================Create a new user====================================================================

  const newUser = await User.create({
    username: username.trim(),
    email: email.trim(),
    interests: Array.isArray(interests) ? interests : interests.split(","),
    password: password.trim(),
    coverImage: imagePath,
  });

  // ====================Check if the user was created successfully========================================
  // ============================selecting the user without password and refreshToken======================

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
     return res.status(400).json({ message: "User not created." });;
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

// =============================login user=============================================================
const loginUser = asyncHandler(async (req, res) => {
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
    "+password +refreshToken"
  );
  if (!existingUser) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // =========================================Check if the password is correct=================
  // console.log("Entered password:", password);

  const isPasswordCorrect = await existingUser.comparePassword(password.trim());
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  //  ==========================================Check if the user is an admin=================
  // const isAdmin = existingUser.role === "admin";
  // if (isAdmin) {
  //   throw new apiErrors(
  //     403,
  //     "You are accessing as an admin: please use the admin login route"
  //   );
  // }

  // =========================================Generate a refresh token=================

  const { accessToken, refreshToken } = await generateToken(existingUser._id);

  // ===================================== making user reference to the refresh token=================

  const loggedInUser = await User.findById(existingUser._id).select(
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
      user: loggedInUser, 
      accessToken,
      refreshToken,
      message: "User logged in successfully",
    });
});

// ============================= generate token function==========================================================

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiErrors(
      500,
      "Internal server error .Somethinbg went wrong while generating token"
    );
  }
};

// ===========================================Logout user===================================================

const logoutUser = asyncHandler(async (req, res) => {
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

// ===========================================refresh access token===============================

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.headers["authorization"]?.split(" ")[1];

  if (!incomingRefreshToken) {
    throw new apiErrors(401, "Unauthorized", "token not valid");
  }

  try {
    const decodedtoken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedtoken.id).select("-password");

    if (!user) {
      throw new apiErrors(401, "Unauthorized", "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new apiErrors(
        401,
        "Unauthorized 2",
        "Invalid refresh token or user not found"
      );
    }

    const { accessToken, newRefreshToken } = await generateToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      httpOnly: true,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      )
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions);
  } catch (error) {
    throw new apiErrors(401, error.message || "Invalid token");
  }
});

//======================================== change current password ===================================

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id).select("+password ");
  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new apiErrors(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ========================================= get current user=======================================

const getCurrentUser = asyncHandler(async (req, res) => {
   
  const currentUser = await User.findOne(req.user?._id);
   

  return res
    .status(200)
    .json({ data: currentUser, message: "User fetched successfully"});
});

//=============================================update user===========================================

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const newCoverImage = req.file; 

  if (!username || !email) {
    throw new apiErrors(400, "All fields are required");
  }

   let updateFields = {
     username,
     email,
  };
  
    if (newCoverImage) {
      updateFields.coverImage = `/uploads/${newCoverImage.originalname}`;
  }
  

  const userupdated = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateFields,
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json({ data: userupdated ,message: "Account details updated successfully"});
});

// =========================================follow user===========================================

const followUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // current logged-in user
  const targetUserId = req.params.id; // user to follow

  if (userId.toString() === targetUserId.toString()) {
    throw new apiErrors(400, "You cannot follow yourself");
  }

  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new apiErrors(404, "User to follow not found");
  }

  // If already following
  if (user.following.includes(targetUserId)) {
    throw new apiErrors(400, "Already following this user");
  }

  user.following.push(targetUserId);
  targetUser.followers.push(userId);

  await user.save();
  await targetUser.save();

  res.status(200).json(new ApiResponse(200, "User followed successfully"));
});

// ===============================================unfollow user===================================
const unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; // current logged-in user
  const targetUserId = req.params.id; // user to unfollow

  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new apiErrors(404, "User to unfollow not found");
  }

  // If not following
  if (!user.following.includes(targetUserId)) {
    throw new apiErrors(400, "You are not following this user");
  }

  user.following.pull(targetUserId);
  targetUser.followers.pull(userId);

  await user.save();
  await targetUser.save();

  res.status(200).json(new ApiResponse(200, "User unfollowed successfully"));
});

// =========================get followers===============================================================
const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).populate(
    "followers",
    "username email coverImage"
  );

  if (!user) {
    throw new apiErrors(404, "User not found");
  }

  res.status(200).json({ followers: user.followers });
});


// =========================get following===============================================================
 const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).populate(
    "following",
    "username email coverImage"
  );

  if (!user) {
    throw new apiErrors(404, "User not found"); 
  }

  res.status(200).json({ following: user.following });
});

// ===================================get profile=============================================================
const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("followers", "username email coverImage")
      .populate("following", "username email coverImage");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});


const getAllUsers = asyncHandler(async (req, res, next) => {
  const currentUserId = req.user._id;
  try {
 const allusers = await User.find({ _id: { $ne: currentUserId } })
   .sort({ createdAt: -1 })
   .limit(10);
    if (allusers.length === 0) {
      return res.status(200).json({allusers,message:" users  not acquired"})
    } 
        return res
          .status(200)
          .json({ data:allusers, message: "All users acquired" });

  } catch (error) {
    next(error)
  }

})




export {
  registerUser,
  loginUser,
  logoutUser,
  generateToken,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  getAllUsers
};

  













  














  
// const updateUser = asyncHandler(async (req, res) => {
//   const { username, email } = req.body;
//   const userId = req.user._id;

//   // =========================================validation===================================

//   if (!username.trim() || !email.trim()) {
//     throw new apiErrors(400, "All fields are required");
//   } else if (username.length < 6) {
//     throw new apiErrors(400, "Username must be at least 6 characters long");
//   } else if (!emailRegex.test(email)) {
//     throw new apiErrors(400, "Email is not valid");
//   }

//   // =========================================Check if the user exists in the database=================

//   const existingUser = await User.findById(userId).select(
//     "+password +refreshToken"
//   );
//   if (!existingUser) {
//     throw new apiErrors(400, "Invalid email or password");
//   }

//   // =========================================Check if the password is correct=================

//   existingUser.username = username.trim();
//   existingUser.email = email.trim();

//   await existingUser.save({ validateBeforeSave: false });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "User updated successfully"));
// });
