const router = require('express').Router();

const { isSignedIN, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserByID, userPurchasedList } = require('../controllers/user');
const { updateStock } = require('../controllers/product');
const { getOrderByID, createOrder, getOrders, getOrderStatus, updateStatus } = require('../controllers/order');

router.param('userID', getUserByID);
router.param('orderID', getOrderByID);

router.post('/order/create/:userID', isSignedIN, isAuthenticated, userPurchasedList, updateStock, createOrder);/* 
    Middleware Used in Sequence are as Follows 
    1. Is User Signed In
    2. Is User Authenticated
    3. Pushing Order into User Purchase List
    4. Updating Product Stock
    5. If Amount is Successfully Deducted from User and Stock is Also Updated then Create Order For Specific User
*/
router.get('/order/all/:userID', isSignedIN, isAuthenticated, isAdmin, getOrders);
router.get('/order/status/:userID', isSignedIN, isAuthenticated, isAdmin, getOrderStatus);
router.put('/order/:orderID/status/:userID', isSignedIN, isAuthenticated, isAdmin, updateStatus);

module.exports = router;