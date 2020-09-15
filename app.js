require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');

const app = express();
const PORT = process.env.PORT || 3200;

// Database Connection
mongoose.connect(process.env.DATABASEURL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then( () => {
    console.log('Database Successfully Connected');
} )
.catch( () => {
    console.log('Database Failed To Connect');
} );

// 3rd Party Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Custom Middleware
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);
app.use('/api', orderRoute);

// Custom Middleware
app.get('/', (req, res) => {
    res.json({ msg: "API Working Successfully" });
})

// Server Starting
app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})