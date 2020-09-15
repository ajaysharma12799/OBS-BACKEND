const router = require('express').Router();

const { getUserByID, getUser, updateUser, userPurchasedList } = require('../controllers/user');
const { isSignedIN, isAuthenticated, isAdmin } = require('../controllers/auth');

router.param('userID', getUserByID); // Fetch User-ID from URL

router.post('/user/:userID',isSignedIN, isAuthenticated, getUser); // Route for Getting User NOTE:- Only if User if SignedIN and is Authenticated will be able to get User
router.put('/user/:userID',isSignedIN, isAuthenticated, updateUser); // Route for Updating User NOTE:- Only If User is SignedIn and is Authenticated will be able to update User
router.get('/orders/user/:userID', isSignedIN, isAuthenticated, userPurchasedList); // Route for User Order List means:- How many products are there in user purchase list

module.exports = router;