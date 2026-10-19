import express from 'express';
const router = express.Router();

import createOrder from '../controller/order_Controller.js';
import { verifyUserAuth } from '../middleware/userAuth.js';

router.post("/new/order", verifyUserAuth, createOrder);