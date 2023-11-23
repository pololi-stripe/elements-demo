const usStripe = require("stripe")(process.env.US_STRIPE_SK);
const euStripe = require("stripe")(process.env.EU_STRIPE_SK);

export default async function handler(req, res) {
  const { currency, mode, paymentMethodId } = req.body;

  const stripe = currency === "usd" ? usStripe : euStripe;

  try {
    let intent;
    if (mode === "setup") {
      intent = await stripe.setupIntents.create({
        automatic_payment_methods: { enabled: true },
      });
    } else {
      let params = {
        amount: 1099,
        currency: currency || "usd",
        automatic_payment_methods: { enabled: true },
      };
      if (paymentMethodId) {
        params = {
          ...params,
          payment_method: paymentMethodId,
        };
      }

      intent = await stripe.paymentIntents.create(params);
    }
    res.status(200).json({
      client_secret: intent.client_secret,
      status: intent.status,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
}
