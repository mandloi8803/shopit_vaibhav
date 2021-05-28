const express = require('express')
const router = express.Router();
const {deleteOrder,newOrder,getSingleOrder,myOrders,allOders,updateOrder}=require('../controllers/orderController');
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');
router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser,myOrders);
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles('admin'),allOders);
router.route('/admin/orders/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
router.route('/admin/orders/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);                                 
module.exports = router;
