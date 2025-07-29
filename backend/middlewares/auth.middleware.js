import asyncHandler from "../utils/asyncHandler.js";
import apiErrors from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// ================================== verifyJWT middleware ====================================
// This middleware checks if the user is authenticated by verifying the JWT token
// If the token is valid, it retrieves the user from the database and attaches it to the request object

const verifyJWT = asyncHandler(async (req, res, next) => {
  // =========the token comes as Bearer <token> in the header so [1] accesses the token===================

  const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

  
  if (!token) {
    throw new apiErrors(401,"You are not authorized to access this route .Need Login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded);
    const user = await User.findById(decoded?.id).select("-password -refreshToken")
    // console.log(user);
    if (!user) {
      throw new apiErrors(404,"User not found");
    }
    req.user = user;

    next();
  }catch (error) {
    throw new apiErrors(401,error?.message || "Invalid token");
  }
});


const verifyAdmin = asyncHandler(async (req, res, next) => {

  verifyJWT(req, res, async () => {
    try {
       if (req.user.role !== "admin") {
         throw new apiErrors(403,"Admins only!");
       }
       next(); 
      
     } catch (error) {
      
       next(error);
     }
    
  }); 
});


const verifyUser = asyncHandler(async (req, res, next) => {
  
  verifyJWT(req, res, async () => {
    try {
      if (req.user?.role === "user" || req.user?.role === "admin") {
        return next();
      }      
    } catch (error) {
      next(error);
    }
  }); 
      
 });

export { verifyJWT , verifyAdmin , verifyUser};