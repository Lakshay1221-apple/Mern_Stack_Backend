import express from 'express';
const router = express.Router();

import { createOrder, getSingleOrder, allMyOrders } from '../controller/order_Controller.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

router.post("/new/order", verifyUserAuth, createOrder);
router.get("/my/orders", verifyUserAuth, allMyOrders);
router.get("/admin/order/:id", verifyUserAuth, roleBasedAccess('admin'), getSingleOrder);

export default router;