import express from 'express';
const router = express.Router();
import {createProducts ,getAllProducts, updateProduct } from '../controller/product_Controller.js'

//Routes 

// Product Routes
router.get("/products", getAllProducts);
router.post("/products", createProducts);
router.put("/product/:id", updateProduct);
// router.route("/product").get(getSingleProduct);



export default router;
