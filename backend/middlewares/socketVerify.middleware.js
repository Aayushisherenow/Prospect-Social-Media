import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import apierrors from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";


const verifySocketJWT = async (socket, next) => {
  try {
    // Get token either from handshake.auth or from headers
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization &&
        socket.handshake.headers.authorization.split(" ")[1]);

    if (!token) {
      throw new apierrors("Authentication error: No token provided");
    }

      console.log("Received token:", token);

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new apierrors("Authentication error: User not found");
    }

    // Attach user data to socket
    socket.user = user;

    next();
  } catch (err) {
    console.error("Socket authentication error:", err.message);
    
      return next(new apierrors("Authentication error: " + (err.message || "Invalid token"), 401));
    
  }
};

export { verifySocketJWT };
