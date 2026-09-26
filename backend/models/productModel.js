import mongoose from "mongoose";

const ProductProductSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please Enter The Product Name"],
        trim : true,
    },

    description : {
        type : String, 
        required : [true, "Please Enter The Product Description"],
        trim : true,
    },

    price : {
        type : Number,
        required : [true, "Please Enter The Product Price"],
        maxLength : [7, "Price cannot exceed 7 characters"]
    },

    Ratings : {
        type : Number,
        default : 0
    },

    image : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],

    category : {
        type : String,
        required : [true, "Please Enter The Product Category"]
    },

    stock : {
        type : Number,
        required : [true, "Please Enter The Product Stock"],
        maxLength : [4, "Stock cannot exceed 4 characters"],
        default : 1
    },

    numOfReviews : {
        type : Number,
        default : 0
    },

    reviews : [
        {
            name : {
                type : String,
                required : true
            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            }
        }
    ],

    createdAt : {
        type : Date,
        default : Date.now
    }
})

export default mongoose.model("Product", ProductProductSchema);