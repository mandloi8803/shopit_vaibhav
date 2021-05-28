//const express = require('express');
//const router = express.Router();
const express = require('express');
const router = express.Router();
const { registerUser,loginUser,logout, forgotPassword,resetPassword,getUserProfile,updatePassword,updateProfile,allUsers,getUserDetails,updateUser,deleteUser } = require('../controllers/authController');
const ErrorHandler = require('../utils/errorHandler');
const { isAuthenticatedUser,authorizeRoles } =require('../middleware/auth');

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').post(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser,getUserProfile);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),allUsers);
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
module.exports = router;