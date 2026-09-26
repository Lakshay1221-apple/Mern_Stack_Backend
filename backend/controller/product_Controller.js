import Product from '../models/productModel.js';

// Creating Product 

export const createProducts = async (req, res) => {
     const product = await Product.create(req.body)
     res.status(201).json({
        success : true,
        product
     })
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