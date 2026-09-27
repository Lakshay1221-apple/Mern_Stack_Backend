import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';

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

// Get All Products

export const getAllProducts = async(req, res) => {
    const products = await Product.find()
    res.status(200).json({
        success : true,
        products
    })
}

// Update Product 
 
export const updateProduct = async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        }
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    return res.status(200).json({
        success: true,
        product
    });
};

// Delete Product 

export const deleteProduct = async (req, res) => {
    const product =  await Product.findByIdAndDelete(req.params.id);

    if(!product){
        return res.status(404).json({
            success : false,
            message : "Product not found"
        });
    }   

    return res.status(200).json({
        success : true,
        message : "Product deleted successfully"
    });
}

// Getting Single Product 

export const getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    console.log(product);

    if(!product){
        return res.status(404).json({
            success : false,
            message : "Product not found"
        })
    }

    return res.status(200).json({
        success : true,
        product
    })
}