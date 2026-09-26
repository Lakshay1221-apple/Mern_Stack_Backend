import Product from '../models/productModel.js';

// Creating Product 

export const createProducts = async (req, res) => {
     try {
         const product = await Product.create(req.body);
         console.log("Product created:", product);
         res.status(201).json({
            success: true,
            product
         });
         
     } catch (error) {
         res.status(400).json({
            success: false,
            message: error.message
         });
     }
}

export const getAllProducts = (req, res) => {
    res.status(200).json({
        message: "All products retrieved successfully"
    })
}

// export const getSingleProduct = (req, res) => {
//     res.status(200).json({
//         message : "Single product retrieved successfully"
//     })
// }
