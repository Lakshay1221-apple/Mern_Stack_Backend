import express from 'express';
const router = express.Router();

import { createOrder, getSingleOrder, allMyOrders, getAllOrders } from '../controller/order_Controller.js';
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';

router.post("/new/order", verifyUserAuth, createOrder);
router.get("/my/orders", verifyUserAuth, allMyOrders);
router.get("/admin/order/:id", verifyUserAuth, roleBasedAccess('admin'), getSingleOrder);
router.get("/admin/orders", verifyUserAuth, roleBasedAccess('admin'), getAllOrders);


export default router;