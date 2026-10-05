import express from 'express';
const router = express.Router();
import {createProducts ,getAllProducts, updateProduct , deleteProduct, getSingleProduct} from '../controller/product_Controller.js'
import { verifyUserAuth } from '../middleware/userAuth.js';
//Routes 

// Product Routes
router.get("/products", verifyUserAuth , getAllProducts);
router.post("/products", createProducts);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);
router.get("/product/:id", getSingleProduct);



export default router;
