const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const user = require('../models/user');
//create new product for 
exports.newProduct = catchAsyncErrors( async (req,res,next) => {
    console.log(req.body);
    req.body.user = req.user.id;
   console.log(req.body)
    const product = await Product.create(req.body);
        
    res.status(201).json({
        success: true,
        productCount,
        product
    })
})

// exports.getProducts =  (req, res, next) => {

//     res.status(200).json({
//         success: true,
//         message: 'This route will show all products in database'
//     })
// }
//fetch list of all product
exports.getProducts=catchAsyncErrors( async(req,res,next) => {
    //return next(new ErrorHandler('My Error',400))
    const resPerPage=8;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resPerPage)
    //const products=await Product.find();
    const products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        count:products.length,
        productCount,
        resPerPage,
        products
    })
})
//get single product  by id
exports.getSingleProduct =catchAsyncErrors( async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        // return res.status(404).json({
        //     success: false,
        //     message: 'product not found'
        // })
        return next(new ErrorHandler('Product not found',404))
    }
    else{
    res.status(200).json({
        success:true,
        product
    })
}})
//for update product
exports.updateProduct =catchAsyncErrors (async(req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success: false,
            message:'product not found'
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true,
        useFindAndModify:false
    });
    res.send(200).json({
        success: true,
        product
    })

})
//for delete product
exports.deleteProduct =catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('Product not found',404))
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:'product deleted from list'
    })
})
console.log('kkkknnn');
//create rating and review 
// exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{
//     const {rating, comment, productId} = req.body;
//     const review ={
//         user:req.user._id,
//         name:req.user.name,
//         rating:Number(rating),
//         comment
//     }
//     const product = await Product.findById(productId);

//     const isReviewed = product.reviews.find(
//         r=>r.user.toString() === req.user._id.toString()
//     )
//     //if you already ratings
//     if(isReviewed){
//         product.reviews.forEach(review=>{
//             if(review.user.toString()===req.user._id.toString()){
//                 review.comment=comment;
//                 review.rating=rating;
//         }
//         })
//     }
//     else{
//         product.reviews.push(review);
//         product.numofReviews = product.reviews.length
//     }
//     // over all rating
//     product.ratings = product.reviews.reduce((acc,item)=>item.rating + acc,0)/product.reviews.length
    
// }) 

// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
         
    const review = {
        //user: req.user.id,
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    console.log(req.user);
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfRevi
        ews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

//Get Product review==> /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})