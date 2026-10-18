import express from 'express';
const router = express.Router();
import {createProducts ,getAllProducts, updateProduct , deleteProduct, getSingleProduct, getAdminProducts} from '../controller/product_Controller.js'
import { roleBasedAccess, verifyUserAuth } from '../middleware/userAuth.js';
//Routes 

// Product Routes
router.get("/products", getAllProducts);
router.get("/admin/products", verifyUserAuth , roleBasedAccess("admin"), getAdminProducts);
router.post("/admin/product/create", verifyUserAuth , roleBasedAccess("admin"),createProducts);
router.put("/admin/product/:id",verifyUserAuth ,roleBasedAccess("admin") , updateProduct);
router.delete("/admin/product/:id", verifyUserAuth,roleBasedAccess("admin") ,deleteProduct);
router.get("/product/:id", getSingleProduct);



export default router;
