import express from 'express';
const router = express.Router();
import {createProducts ,getAllProducts} from '../controller/product_Controller.js'

//Routes 

// Product Routes
router.get("/products", getAllProducts);
router.post("/products", createProducts);
// router.route("/product").get(getSingleProduct);



export default router;
