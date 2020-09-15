const User = require('../models/user');
const Order = require('../models/order');

exports.getUserByID = (req, res, next, id) => { // Function to find User by ID
    User.findById(id).exec( (error, user) => {
        if(error) {
            return res.status(400).json({ error: 'No User Found' });
        }
        req.profile = user; // Saving user Profile in Request Object for Further Use
        next();
    } );
}

exports.getUser = (req, res) => { // Function to get User
    req.profile.salt = undefined;
    req.profile.encryptedPassword = undefined;
    req.status(200).json(req.profile);
}

exports.updateUser = (req, res) => { // Function to Update User
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (error, updatedUser) => {
            if(error) {
                return res.status(400).json({ error: 'Failed to Update User' });
            }
            updatedUser.salt = undefined;
            updatedUser.encryptedPassword = undefined;
            req.status(200).json(updatedUser);
        }
    )
}

exports.userPurchasedList = (req, res) => { // Function for Storing Order in User-Purchase-List
    Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    /* 
        Populate is used to fill specific field in document using other collection
        NOTE:- In this " USERPURCHASELIST " function we will fetch specific orders present in particular user account
    */
    .exec( (error, order) => {
        if(error) {
            return res.status(400).json({ error: 'No Order Present in This Account' });
        }
        res.status(200).json(order);
    } )
}

