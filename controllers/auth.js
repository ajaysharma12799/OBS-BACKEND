/* 
    This Controller is for Authencation
*/
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.signup = (req, res) => {
    const errors = validationResult(req); // We are using validationResult to capture all error message which came from FormData with request object
    if( !errors.isEmpty() ) { // Checking whether we got error from Incomming-FormData
        return res.status(422).json({ error: errors.array()[0].msg })
    }
    const newUser = new User(req.body);
    newUser.save()
    .then( (user) => {
        return res.json(user);
    } )
    .catch( () => {
        return res.status(400).json({ error: 'Failed to Save User' })
    } )
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    User.findOne({email}, (error, user) => {
        if(error || !user) { // Checking whether we have error and if user is present in database
            return res.status(400).json({ error: 'User Email Does Not Exist' })
        }
        if( !user.authenciate(password) ) { // If User Password Does't Match
            return res.status(400).json({ error: 'Email or Password Does Not Match' })
        }
        // All Validation Succeed
        const token = jwt.sign({ _id: user._id }, process.env.SECRET) // Creating Token using JWT
        res.cookie('token', token, { expire: new Date() + 9999 }) // Putting token in Cookie

        console.log(` Send Response to Frontend : ${user.firstName} + ${user.lastName} + ${user.email} `);

        const { _id, firstName, lastName, email, role } = user // Destructure USER object to send data to FrontEnd
        return res.json({ token, user: { _id, firstName, lastName, email, role } }) // Send Response to FrontEnd
    })
}

exports.signout = (req, res) => {
    res.clearCookie('token'); // Clearing Cookie on User Signout
    res.json({ msg: 'User Signout Successfully' })
}

/* 
    Custom Authentication Middleware and Protected Route Middleware
*/

exports.isSignedIN = expressJWT({ // Protected Route Middleware for Checking Whether User is Signedin or not
    secret: process.env.SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
})

exports.isAuthenticated = (req, res, next) => { // Auth Middleware for Checking Whether SignedIN User is Same as who Registered in Application
    let Checker = (req.profile && req.auth) && (req.profile._id == req.auth._id);
    // TODO: Proper Documentation of This Method is Required
    if( !Checker ) {
        return res.status(403).json({ error: 'Access Denied Failed to Authenticate' });
    }
    next();
}

exports.isAdmin = (req, res, next) => { // Auth Middleware for Checking Whether Registered User is Admin or Not
    if(req.profile.role === 0) {
        res.status(403).json({ error: 'Access Denied You are Not Admin' })
    }
    next();
}