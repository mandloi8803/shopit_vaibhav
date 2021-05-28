const mongoose= require('mongoose');
const productSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,'please enter product name'],
    trim:true,
    maxLength:[100,'product name can not more then 100 charcter']
},
price:{
    type:Number,
    required:[true,'please enter product name'],
    maxLength:[5,'product price can not more then 5 number'],
    default:0.0
},
description:{
    type:String,
    required:[true,'please provide product details']
    
},
ratings:{
    type:Number,
    default:0
},
images:[
    {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    }
],
category:{
    type:String,
    required:[true,'Please Select catagory for product'],
    enum: {
        values: [
            'Electronics',
            'Cameras',
            'Laptops',
            'Accessories',
            'Headphones',
            'Food',
            "Books",
            'Clothes/Shoes',
            'Beauty/Health',
            'Sports',
            'Outdoor',
            'Home'
        ],
        message: 'Please select correct category for product'
    }
},
seller: {
    type: String,
    required: [true, 'Please enter product seller']
},
stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Product name cannot exceed 5 characters'],
    default: 0
},
numOfReviews: {
    type: Number,
    default: 0
},
reviews: [
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }
],
user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
 },
createdAt: {
    type: Date,
    default: Date.now
}

})
module.exports=mongoose.model('Product',productSchema);