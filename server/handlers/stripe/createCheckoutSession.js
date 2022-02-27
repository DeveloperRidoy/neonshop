import Cart from "../../models/cart";
import Order from "../../models/order";
import Product from "../../models/product";
import AppError from "../../utils/AppError";
import catchASync from "../../utils/catchASync";
import Stripe from "stripe";
import countries from "../../../utils/countries";
import getLoggedInUser from "../../../utils/getLoggedInUser";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

// @route       POST /api/stripe/checkout-session
// @purpose     Create stripe checkout session
// @access      Public
export const createCheckoutSession = catchASync(async (req, res) => {
  const { cartId, shippingAddress, contactEmail, paymentMethod } = req.body;

  const user = await getLoggedInUser(req);

  // check paymentMethod
  if (paymentMethod !== "card" && paymentMethod !== "afterpay_clearpay")
    throw new AppError(
      "paymentMethod must be either card or afterpay_clearpay"
    );

  if (!cartId) throw new AppError(400, "cartId is required");

  if (!shippingAddress) throw new AppError(400, "shippingAddress is required");

  if (!contactEmail) throw new AppError(400, "contactEmail is required");

  // check cart
  const cart = await Cart.findById(cartId).populate({
    path: "items.product",
    model: Product,
  });
  if (!cart)
    throw new AppError(404, "cart not found. Please add to cart again");

  // validate data
  const data = {
    items: cart.items,
    customItems: cart.customItems,
    shippingAddress: { ...shippingAddress, userId: user?._id },
    userId: user?._id,
    contactEmail,
    status: "PENDING_PAYMENT",
    guestCheckout: !user,
    subTotal: cart.subTotal,
    total: cart.total,
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 5), //expire after 5 hours
  };
  await Order.validate(data);

  // create order with PENDING_PAYMENT status
  const order = await Order.create(data);

  const line_items = [];

  // for regular products
  cart.items.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [item.product.images?.[0]?.url],
        },
        unit_amount: item.selectedSize.price * 100,
      },
      quantity: item.count,
    });
  });

  //   for custom products
  cart.customItems.forEach((item) => {
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Custom Neon",
          description: "custom neon created by you",
        },
        unit_amount: item.price * 100,
      },
      quantity: item.count,
    });
  });
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: [paymentMethod],
    line_items,
    client_reference_id: order._id,
    customer_email: contactEmail,
    success_url: `${req.headers.origin}/thank-you?ordered=true`,
    cancel_url: `${req.headers.origin}/shop?text=order cancelled&type=ERROR&timeout=5000`,
    payment_intent_data: {
      receipt_email: contactEmail,
      shipping: {
        name: shippingAddress.firstName + shippingAddress.lastName,
        address: {
          line1: shippingAddress.addressLine1,
          line2: shippingAddress.addressLine2,
          city: shippingAddress.city,
          postal_code: shippingAddress.zip,
          state: shippingAddress.stateOrProvince,
          country: countries.find((i) => i.country === shippingAddress.country)
            .alpha2Code,
        },
      },
    },
    metadata: {
      orderId: String(order._id),
      tempUserId: String(req.cookies.tempUserId),
      websiteUrl: req.headers.origin,
    },
  });

  res.json({
    status: "success",
    sessionId: session.id,
    sessionUrl: session.url,
  });
});
