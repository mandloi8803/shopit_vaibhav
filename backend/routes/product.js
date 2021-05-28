 const express = require('express')
 const router = express.Router();

 const {getProducts, newProduct,getSingleProduct,updateProduct,deleteProduct,createProductReview,getProductReviews,deleteReview}  = require('../controllers/productController');
 const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')
 router.route('/admin/products').get(getProducts);

 router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

 router.route('/product/:id').get(getSingleProduct);
// router.get('/',getProducts);
//  router.route('/products',function(req,res,next){
//      res.send('hello hi ');
//  });
router.route('/admin/product/:id').put(updateProduct);

router.route('/admin/product/:id').delete(deleteProduct);
router.route('/review').put(isAuthenticatedUser,createProductReview);
router.route('/reviews').get(isAuthenticatedUser,getProductReviews);
router.route('/delete/review').delete(isAuthenticatedUser,deleteReview);
module.exports = router;

