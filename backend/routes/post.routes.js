import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPost,
  deletePost,
  addComment,
  getAllPosts,
  toggleLike,
  updatePost,
  deleteComment,
  getPostById,
  getPostsByUser,
  reportPost,
  getfypPosts

} from "../controllers/post.controller.js";

const router = express.Router();

router.use(verifyJWT); //user must be loggedin to access this route

router.route("/feed").post(getAllPosts);
router.route("/create").post(upload.single("multimedia"), createPost);

router.route("/like/:id").put(toggleLike);
router.route("/comment/:id").post(addComment);
router.route("/deletePost/:id").delete(deletePost);
router.route("/update/:id")
  .patch(upload.single("multimedia"), updatePost); 
router.route("/deleteComment/:id").delete(deleteComment);
router.route("/post/:id").get(getPostById);
router.get("/user/:userId", getPostsByUser); 
router.route("/report/:id").put(reportPost);
router.route("/fyp").get(getfypPosts);

export default router;
