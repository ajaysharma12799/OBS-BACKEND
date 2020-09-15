/* 
    This Model is for User
*/
const crypto = require('crypto');
const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({ 
    firstName: {
        type: String,
        trim: true,
        required: true,
        min: 3,
        max: 30
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        min: 3,
        max: 30
    },
    email: {
        type: String,
        trim: true,
        required: true,
        min: 7,
        max: 30,
        unique: true
    },
    encryptedPassword: {
        type: String,
        trim: true,
        min: 5,
        max: 25,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        trim: true,
        default: 0
    },
    purchase: {
        type: Array,
        default: []
    }
});

userSchema.virtual('password')
.set( function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encryptedPassword = this.securePassword(password);
} )
.get( function() {
    return this._password;
} );

userSchema.methods = {
    authenciate: function(plainPassword) {
        return this.securePassword(plainPassword) === this.encryptedPassword;
    },
    securePassword: function(plainPassword) {
        if( !plainPassword ) {
            return "";
        }
        try {
            // Encrypting Password
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword) // Updating plainPassword using SHA256 as Algorithm and this.salt as Key
            .digest('hex'); // Encoding Used to Hash Password, We used Hexa-Decimal Encoding
        }
        catch(error) {
            console.log(`Error Comming From User Model Virtual Method : ${error}`);
            return "";
        }
    }
}

module.exports = mongoose.model('User', userSchema);