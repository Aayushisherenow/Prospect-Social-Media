import express from 'express';

const router = express.Router();
import { login, logout } from '../controllers/auth.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';




router.route('/login').post(login);
router.route('/logout').post(verifyAdmin, logout);

export default router;