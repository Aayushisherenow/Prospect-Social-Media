import express from "express";
import { getMessagesBetweenUsers ,createMessage} from "../controllers/message.controller.js";
import { verifyJWT, verifyUser } from "../middlewares/auth.middleware.js";
import { getFollowers } from "../controllers/user.controller.js";

const router = express.Router();

// Fetch chat history between two users
router.get("/chathistory/:sender/:receiver", verifyUser, getMessagesBetweenUsers);
// Send a new message
router.post("/sendMessage/:receiverId", verifyUser, createMessage);


export default router;
