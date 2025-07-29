import  express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  getAllUsers,
  
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin, verifyUser } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.route("/register").post(upload.single('coverImage'), registerUser);
router.route("/login").post(loginUser);


//==================SECURED ROUTE=================
router.route("/logout").post(verifyUser,logoutUser);
router.route("/refreshtoken").post(verifyUser, refreshAccessToken);
router.route("/changeCurrentPassword").post(verifyUser, changeCurrentPassword);
router.route("/currentUser").get(verifyUser, getCurrentUser);
router.route("/updateAccountDetails").put(upload.single('coverImage'),verifyUser, updateAccountDetails);


router.post("/follow/:id", verifyUser, followUser);
router.post("/unfollow/:id", verifyUser, unfollowUser);
router.get("/:id/followers", verifyUser, getFollowers);
router.get("/:id/following", verifyUser, getFollowing);
router.get("/allusers",verifyUser,getAllUsers)
router.get("/profile/:userId",verifyUser,getUserProfile); 


//============================admin routes=========================





export default router;