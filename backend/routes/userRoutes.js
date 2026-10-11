import express from 'express';
import { registerUser, loginUser, logout , requestPasswordReset, resetPassword } from '../controller/userController.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forget", requestPasswordReset);
router.post("/reset/:token", resetPassword);


export default router;