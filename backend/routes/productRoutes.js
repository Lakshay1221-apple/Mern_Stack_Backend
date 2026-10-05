import express from 'express';
const router = express.Router();
import {createProducts ,getAllProducts, updateProduct , deleteProduct, getSingleProduct} from '../controller/product_Controller.js'
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
//Routes 

// Product Routes
router.get("/products", verifyUserAuth , getAllProducts);
router.post("/products", verifyUserAuth , roleBasedAccess("admin"),createProducts);
router.put("/product/:id",verifyUserAuth , updateProduct);
router.delete("/product/:id", verifyUserAuth, deleteProduct);
router.get("/product/:id",verifyUserAuth , getSingleProduct);



export default router;
