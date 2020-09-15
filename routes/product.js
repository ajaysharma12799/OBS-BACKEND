const router = require('express').Router();

const { getUserByID } = require('../controllers/user');
const { isSignedIN, isAuthenticated, isAdmin } = require('../controllers/auth');
const { createProduct, updateProduct, getProductByID, getProduct, getProducts, deleteProduct, getPhoto, getAllUniqueCategories } = require('../controllers/product');

router.param('userID', getUserByID);
router.param('productID', getProductByID);

router.post('/product/create/:userID', isSignedIN, isAuthenticated, isAdmin, createProduct); // create product
router.get('/product/:productID', getProduct); // get single product
router.get('/product/photo/:productID', getPhoto); // get product photo
router.get('/products', getProducts); // get all products

router.put('/product/:productID/:userID', isSignedIN, isAuthenticated, isAdmin, updateProduct) // update product
router.delete('/product/:productID/:userID', isSignedIN, isAuthenticated, isAdmin, deleteProduct) // delete product

router.get('/products/categories', getAllUniqueCategories); // get all unique categories

module.exports = router;