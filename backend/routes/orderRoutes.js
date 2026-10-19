import express from 'express';
const router = express.Router();

import { createOrder, getSingleOrder } from '../controller/order_Controller.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

router.post("/new/order", verifyUserAuth, createOrder);
router.get("/order/:id", verifyUserAuth, roleBasedAccess('admin'), getSingleOrder);

export default router;