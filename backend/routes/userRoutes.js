import express from 'express';
import { registerUser, loginUser, logout , requestPasswordReset, resetPassword , getUserDetails, updatePassword} from '../controller/userController.js';
import { verifyUserAuth } from '../middleware/userAuth.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forget", requestPasswordReset);
router.post("/reset/:token", resetPassword);
router.get("/profile",verifyUserAuth, getUserDetails);
router.post("/password/update", verifyUserAuth, updatePassword);


export default router;