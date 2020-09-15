const router = require('express').Router();
const { isSignedIN, isAuthenticated } = require('../controllers/auth');
const { getToken, processPayment } = require('../controllers/paymentPaypal');

router.get('/payment/gettoken/:userID', isSignedIN, isAuthenticated, getToken);
router.post('/payment/braintree/:userID', isSignedIN, isAuthenticated, processPayment);

module.exports = router;