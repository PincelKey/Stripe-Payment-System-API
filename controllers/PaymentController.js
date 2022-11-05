const stripe = require('stripe')('sk_test_51LL9sGEl9RLg2yjvlLfibzGH6XETW5cpkDv8dvoGY4Ik9o3u7UjRcs2o84VZbGP4iD45l0bf90HB18358WLnPVnZ00NRZ9dQsd')

class PaymentController {
    async login (req, res) {
        const customer = await stripe.customers.create({
            email: req.body.email
        });

        if (customer) {
            res.send({
                data: customer,
                status: true,
            });
        } else {
            res.send({
                message: 'Customer not created',
                status: false
            });
        }
    }

    async storeOrders (req, res) {
        const productType = req.params.product_type;
        const customerId = req.body.customer_id;

        switch (productType) {
            case 'course':
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: 20 * 100,
                    currency: 'USD',
                    description: 'Curso de WordPress Avanzado',
                    customer: customerId,
                })

                if (paymentIntent) {
                    res.send({
                        status: true,
                        data: paymentIntent.client_secret
                    })
                }

                res.send({
                    status: false,
                    message: 'No payment intent created'
                })
                break;

            default:
                res.send({
                    status: false,
                    message: 'No right product type'
                })
                break;
        }
    }
}

module.exports = PaymentController