import express from 'express';
import { registerUser, loginUser, logout , requestPasswordReset } from '../controller/userController.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forget", requestPasswordReset);

export default router;