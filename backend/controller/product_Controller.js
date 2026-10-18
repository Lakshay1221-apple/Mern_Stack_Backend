import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsynError from '../middleware/handleAsynError.js';
import APIFunctionality from '../utils/apiFunctionality.js';
 
// Creating Product 
export const createProducts = handleAsynError(async (req, res, next) => {
    req.user.id;
    
         const product = await Product.create(req.body);
         console.log("Product created:", product);
         res.status(201).json({
            success: true,
            product
         });    
});

// Get All Products
export const getAllProducts = handleAsynError(async(req, res, next) => {
    const apiFeatures = new APIFunctionality(Product.find(), req.query).search().filter();

    // Getting Filtered query before page pagination

    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();
    console.log("Filtered Product Count:", productCount);

    //Calculate total page 

    const totalPage = Math.ceil(productCount / resultPerPage);
    const page = Number(req.query.page) || 1;
    if(page > totalPage && totalPage !== 0){
        return next(new HandleError("Page not found", 404));
    }

    // apply pagination 

    apiFeatures.pagination(resultPerPage);
    const products = await apiFeatures.query;

    const product = await Product.find().skip(resultPerPage * (page - 1)).limit(resultPerPage);

    if(!product || products.length == 0){
        return next(new HandleError("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        totalPage,
        current_page: page
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
  
// Creating and updating review for product
export const createProductReview = handleAsynError(async (req, res, next) => {

    const {rating, comment, productId} = req.body;

    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    };   

    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave : false});

    res.status(200).json({
        success : true,
        message : "Review added successfully"
    })
});

// Admin getting all products 
export const getAdminProducts = handleAsynError(async (req, res, next) => { 
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})