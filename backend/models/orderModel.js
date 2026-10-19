import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    shippingInfo : {
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        }, 

        country: {
            type : String,
            required : true
        },
        pinCode : {
            type : Number,
            required : true
        },

        phoneNo : {
            type : Number,
            required : true
        },
    },

    orderItems : [
        {
            name : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            }
        }
    ]
})