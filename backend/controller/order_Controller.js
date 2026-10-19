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