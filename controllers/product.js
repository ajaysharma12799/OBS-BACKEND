const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductByID = (req, res, next, id) => {
    Product.findById(id).exec( (error, product) => {
        if(error) {
            return res.status(400).json({ error: 'Failed to Find Product' });
        }
        req.product = product;
        next();
    } )
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm(); // Creating Object of Formidable
    form.keepExtensions = true; // We need to Keep it True because we need File with Original Extension

    form.parse(req, (error, fields, file) => { // Parsing Form
        if(error) {
            return res.status(400).json({ error: 'Problem With Image' });
        }
        // TODO: Restriction with Fields
        /* 
            TODO: We can have more aggresive fields checking like we do it in auth controller eg. signin or signup
        */
        const { name, description, price, category, stock } = fields; // Destructure Fields
        if( !name || !description || !price || !category || !stock ) {
            return res.status(400).json({ error: 'Please Include all Fields' })
        }
        let product = new Product(fields);
        
        if(file.photo) { // Handling File 
            if(file.photo.size > 5000000) { // Checking File Size if large than 5MB
                return res.status(400).json({ error: 'File Size to Big' })
            }
            product.photo.data = fs.readFileSync(file.photo.path); // Setting File Path
            product.photo.contentType = file.photo.type; // Setting File ContentType
        }
        // Save Image To DataBase
        product.save( (error, product) => {
            if(error) {
                return res.status(400).json({ error: 'Failed To Save Product' })
            }
            res.status(200).json(product);
        } )
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined; /* 
        NOTE:- We undefined photo because when we will get single product then response will be heavy because of binary-data
        so will create new middleware for serving photo

        NOTE:- This is only for performance optimization
    */
    res.json(req.product);
}

exports.getPhoto = (req, res, next) => { // Middleware for Loading Photo
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType); // Setting Content-Type of Photo or Binary-Data
        return res.status(200).send(req.product.photo.data); // Sending Photo to FrontEnd
    }
    next();
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm(); // Creating Object of Formidable
    form.keepExtensions = true; // We need to Keep it True because we need File with Original Extension

    form.parse(req, (error, fields, file) => { // Parsing Form
        if(error) {
            return res.status(400).json({ error: 'Problem With Image' });
        }

        // Main Updation Code
        let product = req.product; // We are fetching product which is encountered by productID in URL
        product = _.extend(product, fields); // lodash will replace old field with new field value
        
        if(file.photo) { // Handling File 
            if(file.photo.size > 5000000) { // Checking File Size if large than 5MB
                return res.status(400).json({ error: 'File Size to Big' })
            }
            product.photo.data = fs.readFileSync(file.photo.path); // Setting File Path
            product.photo.contentType = file.photo.type; // Setting File ContentType
        }
        // Save Image To DataBase
        product.save( (error, product) => {
            if(error) {
                return res.status(400).json({ error: 'Failed To Save Product' })
            }
            res.status(200).json(product);
        } )
    })
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove( (error, deletedProduct) => {
        if(error) {
            return res.status(400).json({ error: 'Failed to Delete Product' })
        }
        res.status(200).json(deletedProduct);
    } )
}

exports.getProducts = (req, res) => { // Function to get all Products
    /* 
        NOTE:- We have applied pagination that how many products we have to show and we have applied sorting feature
    */
    let limit = req.query.limit ? parseInt(req.query.limit) : 12;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    Product.find()
    .populate('category')
    .select('-photo')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec( (error, products) => {
        if(error) {
            return res.status(400).json({ error: 'No Product Found' });
        }
        res.status(200).json(products);
    } )
}

exports.getAllUniqueCategories = (req, res) => { // Function to Get All Unique Categories
    Product.distinct('category', {}, (error, uniqueCategories) => {
        if(error) {
            return res.status(400).json({ error: 'No Categories Found' })
        }
        res.status(200).json(uniqueCategories);
    })
}

exports.updateStock = (req, res, next) => { // Middleware to Update Product Stock MEANS:- Increase Sold Count and Decrease Stock Counter
    let stockOperation = req.body.order.products.map( product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count } }
            }
        }
    } )

    Product.bulkWrite(stockOperation, {}, (error, products) => {
        if(error) {
            return res.status(400).json({ error: 'Bulk Operation Failed' });
        }
        res.status(200).json(products);
    })
    next();
}