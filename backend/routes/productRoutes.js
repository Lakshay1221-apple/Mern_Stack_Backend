import express from 'express';
const router = express.Router();
import {getAllProducts} from '../controller/product_Controller.js'

//Routes 

// Product Routes
router.route("/products").get(getAllProducts);
// router.route("/product").get(getSingleProduct);



export default router;