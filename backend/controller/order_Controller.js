import Order from "../models/orderModel.js";
import HandleError from "../utils/handleError.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import handleAsynError from "../middleware/handleAsynError.js";

// Create New Order 
export const createOrder = handleAsynError(async (req, res, next) => {

    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
        })
});

// Getting single order 
export const getSingleOrder = handleAsynError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new HandleError("Order not found with this id", 404));
    }
  
    res.status(200).json({
        success: true,
        order
    })
});

// All my orders
export const allMyOrders = handleAsynError(async(req, res, next) => {
    const order = await Order.find({user: req.user._id});

    if(!order){
        return next(new HandleError("No orders found for this user", 404));
    }

    res.status(200).json({ 
        success: true,
        order
    })
});

// Get all orders (Admin)
export const getAllOrders = handleAsynError(async(req, res, next) => {
    const orders = await Order.find();

    let totalamount = 0;
    orders.forEach((order) => {
        totalamount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        orders
    })
});

//Update Order Status (Admin)
export const updateOrderStats = handleAsynError(async(req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new HandleError("Order not found with this id", 404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new HandleError("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        order
    })
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    if(!product){
        throw new HandleError("Product not found with this id", 404);
    }

    if(product.stock < quantity){
        throw new HandleError(`Not enough stock for product ${product.name}`, 400);
    }

    product.stock -= quantity;

    await product.save({validateBeforeSave: false});
}