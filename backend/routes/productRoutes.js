import express from 'express';
const router = express.Router();
import {createProducts ,getAllProducts, updateProduct , deleteProduct, getSingleProduct} from '../controller/product_Controller.js'

//Routes 

// Product Routes
router.get("/products", getAllProducts);
router.post("/products", createProducts);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);
router.get("/product/:id", getSingleProduct);



export default router;
