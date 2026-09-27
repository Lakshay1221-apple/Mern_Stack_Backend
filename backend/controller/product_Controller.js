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

// Get All Products

export const getAllProducts = async(req, res) => {
    const products = await Product.find()
    res.status(200).json({
        success : true,
        products
    })
}

// Update Product 

export const updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);

    console.log(product);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json({
        success: true,
        product
    });
};

// Delete Product 

export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    console.log(product);

    if(!product){
        return res.status(404).json({
            success : false,
            message : "Product not found"
        });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Product deleted successfully"
    });
}