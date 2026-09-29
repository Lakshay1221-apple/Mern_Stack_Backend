import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsynError from '../middleware/handleAsynError.js';
 
// Creating Product 
export const createProducts = handleAsynError(async (req, res, next) => {
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
});

// Get All Products

export const getAllProducts = handleAsynError(async(req, res) => {
    const products = await Product.find()
    res.status(200).json({
        success : true,
        products
    })
})

// Update Product 
 
export const updateProduct = handleAsynError(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        }
    );
    if(!product){
        return next(new HandleError("Product not found", 404));
    }
    return res.status(200).json({
        success: true,
        product
    });
});

// Delete Product 

export const deleteProduct = handleAsynError(async (req, res, next) => {
    const product =  await Product.findByIdAndDelete(req.params.id);

    if(!product){
        return next(new HandleError("Product not found", 404));
    }

    return res.status(200).json({
        success : true,
        message : "Product deleted successfully"
    });
});

// Getting Single Product 

export const getSingleProduct = handleAsynError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    console.log(product);

    if(!product){
        return next(new HandleError("Product not found", 404));
    }

    return res.status(200).json({
        success : true,
        product
    }) 
});
