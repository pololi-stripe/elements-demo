const stripe = require("stripe")(process.env.US_STRIPE_SK, {
  apiVersion: "2022-08-01; custom_checkout_beta=v1",
});

let lastCheckoutSession = null;
const getCachedSession = async () => {
  if (lastCheckoutSession) {
    const session = await stripe.checkout.sessions.retrieve(
      lastCheckoutSession
    );
    if (session.status === "open") {
      return session;
    } else {
      return null;
    }
  }
  return null;
};

export default async function handler(req, res) {
  const cachedSession = await getCachedSession();
  if (cachedSession) {
    res.send({ clientSecret: cachedSession.client_secret });
  } else {
    try {
      const checkout = await stripe.checkout.sessions.create({
        ...{ ui_mode: "custom" },
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "product name",
                description: "product description",
              },
              unit_amount: 19000,
            },
            quantity: 3,
          },
        ],
        phone_number_collection: { enabled: true },
        mode: "payment",
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        return_url: "http://localhost:4242?success=true",
        // shipping_options: [
        //   {
        //     shipping_rate_data: {
        //       display_name: "shipping rate 1",
        //       type: "fixed_amount",
        //       delivery_estimate: {
        //         maximum: {
        //           unit: "day",
        //           value: 3,
        //         },
        //         minimum: {
        //           unit: "day",
        //           value: 2,
        //         },
        //       },
        //       fixed_amount: {
        //         amount: 1000,
        //         currency: "usd",
        //       },
        //     },
        //   },
        //   {
        //     shipping_rate_data: {
        //       display_name: "shipping rate 2",
        //       type: "fixed_amount",
        //       delivery_estimate: {
        //         maximum: {
        //           unit: "day",
        //           value: 1,
        //         },
        //         minimum: {
        //           unit: "day",
        //           value: 1,
        //         },
        //       },
        //       fixed_amount: {
        //         amount: 2000,
        //         currency: "usd",
        //       },
        //     },
        //   },
        // ],
      });
      lastCheckoutSession = checkout.id;
      res.send({ clientSecret: checkout.client_secret });
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  }
}
