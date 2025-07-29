import express from "express";

import { Search } from "../controllers/other.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

// router.use(verifyJWT); //user must be loggedin to access this route

router.get("/search/:query", Search);

export default router;