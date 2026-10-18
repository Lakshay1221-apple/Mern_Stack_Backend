import express from 'express';
import { registerUser, loginUser, logout , requestPasswordReset,
         resetPassword , getUserDetails, updatePassword, updateProfile,
         getUsersList, getSingleUser, changeUserRole, deleteUser} from '../controller/userController.js';

import { verifyUserAuth,  roleBasedAccess} from '../middleware/userAuth.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.post("/password/forget", requestPasswordReset);
router.post("/reset/:token", resetPassword);
router.get("/profile",verifyUserAuth, getUserDetails);
router.post("/password/update", verifyUserAuth, updatePassword);
router.put("/profile/update", verifyUserAuth, updateProfile);
router.get("/admin/user", verifyUserAuth, roleBasedAccess("admin"), getUsersList);
router.get("/admin/user/:id", verifyUserAuth, roleBasedAccess("admin"), getSingleUser);
router.put("/admin/user/:id", verifyUserAuth, roleBasedAccess("admin"), changeUserRole);
router.delete("/admin/user/:id", verifyUserAuth, roleBasedAccess("admin"), deleteUser);




export default router;