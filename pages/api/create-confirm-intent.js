const mxStripe = require("stripe")(process.env.MX_STRIPE_SK);
const usStripe = require("stripe")(process.env.US_STRIPE_SK);
const euStripe = require("stripe")(process.env.EU_STRIPE_SK);

export default async function handler(req, res) {
  const { country, currency, payment_method_id } = req.body;

  const stripe = country === "US" ? usStripe : euStripe;

  try {
    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: 1099,
      currency: currency,
      automatic_payment_methods: { enabled: true },
      payment_method: payment_method_id, // the PaymentMethod ID sent by your client
      return_url: "https://example.com",
    });
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
