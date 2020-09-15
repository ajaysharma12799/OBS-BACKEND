var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.PAYPAL_MERCHANT,
    publicKey: process.env.PAYPAL_PUBLIC_KEY,
    privateKey: process.env.PAYPAL_PRIVATE_KEY
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (error, response) {
        if(error) {
            console.log(error);
            res.status(500).send(error);
        }
        else {
            console.log(response);
            res.status(200).send(response);
        }
    });
}

exports.processPayment = (req, res) => {
    
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
    }, function (error, result) {
        if(error) {
            res.status(400).json(error);
        }
        else {
            res.status(200).json(result);
        }
    });
}