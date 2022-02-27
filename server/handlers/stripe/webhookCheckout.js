import Cart from "../../models/cart";
import Order from "../../models/order";
import AppError from "../../utils/AppError";
import catchASync from "../../utils/catchASync";
import { buffer } from "micro";
import Stripe from "stripe"; 
import User from "../../models/user";
import Product from "../../models/product";
import Category from "../../models/category";
import sendMail from "../../utils/sendMail";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
// @route       POST /api/stripe/webhook-checkout
// @purpose     Listen for checkout session completion
// @access      Public
export const webhookCheckout = catchASync(async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

  if (event.type !== "checkout.session.completed") return;

  if (!event.data.object.metadata)
    throw new AppError(400, "metadata is required");
  const { orderId, tempUserId, websiteUrl } = event.data.object.metadata;

  if (!orderId) throw new AppError(400, "orderId is required");
  if (!websiteUrl) throw new AppError(400, "websiteUrl is required");

  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "PENDING_PAYMENT" },
    { $set: { status: "ORDERED", expireAt: null } },
    { new: true, runValidators: true }
  ).populate([
    { path: "userId", model: User },
    {
      path: "items.product",
      model: Product,
      populate: { path: "category", model: Category },
    },
  ]);

  if (!order) throw new AppError(404, "order not found");

  // delete user cart
  await Cart.findOneAndDelete({
    $or: [{ userId: order.userId?._id }, { userId: tempUserId }],
  });

  // send confirmation email
  try {
    const name = `${
      order.guestCheckout
        ? order.shippingAddress.firstName
        : order.userId?.firstName
    } ${
      order.guestCheckout
        ? order.shippingAddress.lastName
        : order.userId?.lastName
    }`;
    const text = `Congrats ${name}!, \n Your order has been successfully received by us. \n Your order id is: ${
      order._id
    } \n Check your order status ${
      order.guestCheckout ? "" : "from your account or"
    } from here: \n ${websiteUrl}/track-order?orderId=${order._id}&email=${
      order.contactEmail
    }`;

    // send mail to customer
    await sendMail({
      from: `"NeonSignCo" <${process.env.MAIL_SMTP_USERNAME}>`,
      to: order.contactEmail,
      subject: "Your order has been received!",
      text,
    });

    // send mail to business owner 
    await sendMail({
      from: `"NeonSignCo" <${process.env.MAIL_SMTP_USERNAME}>`,
      to: process.env.MAIL_SMTP_USERNAME,
      subject: `You received an order!`,
      text: `You have just received an order from ${name}!. Please check your admin panel for full details.`,
    });
  } catch (error) {}

  return res.json({
    status: "success",
    message: "successfully received order",
  });
});
