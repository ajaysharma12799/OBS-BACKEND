const router = require('express').Router();

const { getUserByID } = require('../controllers/user');
const { isSignedIN, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getCategoryByID, getCategory, getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category');

router.param('userID', getUserByID); // Fetch User-ID from URL
router.param('categoryID', getCategoryByID); // Fetch Category-ID from URL

router.post('/category/create/:userID', isSignedIN, isAuthenticated, isAdmin, createCategory); // Only Admin Can create Category
router.get('/category/:categoryID', getCategory); // This route is used to Get Single Category
router.get('/categories', getCategories); // This route is used for HomePage To Display all categories

router.put('/category/:categoryID/:userID', isSignedIN, isAuthenticated, isAdmin ,updateCategory); // Only Admin Can update Category
router.delete('/category/:categoryID/:userID', isSignedIN, isAuthenticated, isAdmin ,deleteCategory); // Only Admin Can Remove Category

module.exports = router;