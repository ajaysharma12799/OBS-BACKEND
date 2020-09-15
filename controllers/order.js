const { Order, ProductCart } = require('../models/order');

exports.getOrderByID = (req, res, next, id) => { // Function to Find Order By ID
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec( (error, order) => {
        if(error) {
            return res.status(400).json({ error: 'No Order Found in This Account' })
        }
        req.order = order;
        next();
    } )
}

exports.createOrder = (req, res) => { // Function to Create Order
    req.body.order.user = req.profile; /* 
        We are Doing this because in orderSchema we have also saved user that the order belong to specific user
    */
    const newOrder = new Order(req.body.order);
    newOrder.save( (error, order) => {
        if(error) {
            return res.status(400).json({ error: 'Failed to Save Order' });
        }
        res.status(200).json(order);
    } )
}

exports.getOrders = (req, res) => { // Function to Get All Orders
    Order.find()
    .populate('user', '_id name')
    .exec( (error, orders) => {
        if(error) {
            return res.status(400).json({ error: 'Failed to Get Orders' });
        }
        res.status(200).json(orders);
    } )
}

exports.getOrderStatus = (req, res) => { /* 
    FUnction to Get Status Value Stored into Enum From Order Model
    */
    res.status(200).json(Order.schema.path('status').enumValues);
}

exports.updateStatus = (req, res) => { // Function to Update User Order Status
    Order.update(
        { _id: req.body.orderID }, // Searching Order by its Order-ID
        { $set: {status: req.body.status } }, // Updating Status 
        (error, orderStatus) => {
            if(error) {
                return res.status(400).json({ error: 'Cannot Update Order Status' });
            }
            res.status(200).json(orderStatus);
        }
    )
}