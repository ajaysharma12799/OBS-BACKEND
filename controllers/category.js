const Category = require('../models/category');

exports.getCategoryByID = (req, res, next, id) => { // Function to find Category by using ID
    Category.findById(id).exec( (error, category) => {
        if(error) {
            return res.status(400).json({ error: 'Failed to Find Category' })
        }
        req.category = category; // if Category is found then we will store it in request object so that we can fetch single-category
        next();
    } )
}

exports.createCategory = (req, res) => {
    const newCategory = new Category(req.body);
    newCategory.save()
    .then( (category) => {
        return res.json(category);
    } )
    .catch( (error) => {
        return res.status(400).json({ error: 'Failed to Create Category' })
    } )
}

exports.updateCategory = (req, res) => {
    const category = req.category; // Fetching Category from request object which we saved in getCategoryByID function
    Category.findByIdAndUpdate(
        { _id: category._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        ( error, updatedCategory ) => {
            if(error) {
                return res.status(400).json({ error: 'Failed to Update Category' });
            }
            res.status(200).json(updatedCategory);
        }
    )
}

exports.getCategory = (req, res) => { // Function to get Single Category
    res.json(req.category); // we are returning the category which is stored in request which is fetched using getCategoryByID method
}

exports.getCategories = (req, res) => { // Function to get all Categories
    Category.find().exec( (error, categories) => {
        if(error) {
            return res.status(400).json({ error: 'Falied to Load Categories' });
        }
        res.status(200).json(categories);
    } )
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove( (error) => {
        if(error) {
            return res.status(400).json({ error: 'Failed to Remove Category' });
        }
        res.status(200).json({ msg: 'Category Removed Successfully' })
    } )
}