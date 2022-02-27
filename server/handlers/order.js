import Order from "../models/order";
import AppError from "../utils/AppError";
import catchASync from "../utils/catchASync";
import mongoose from 'mongoose';
import User from "../models/user";
import { findOrderByOrderId, findOrdersByCustomerId, findOrdersByCustomerName } from "../utils/queries";
import Product from "../models/product";
import Category from "../models/category";
import Cart from "../models/cart";
import sendMail from '../utils/sendMail';
import getLoggedInUser from '../../utils/getLoggedInUser';



// @route       post api/orders/track-order
// @purpose     track order by order id and email
// @access      Public 
export const trackOrder = catchASync(async (req, res) => {
  const { orderId, email } = req.body; 
  if (!orderId) throw new AppError(400, 'orderId is required');
  if (!mongoose.Types.ObjectId.isValid(orderId)) throw new AppError(400, 'not a valid orderId');
  if (!email) throw new AppError(400, 'email is required');

  const order = await Order.findOne({ _id: orderId, contactEmail: email });

  if (!order) throw new AppError(404, 'order not found');

  return res.json({status: 'success', message: 'successfully retrieved order data', order})
})


// @route       POST api/orders/payapl/create-order
// @purpose     create an order with pending payment
// @access      Public
export const createOrder = catchASync(async (req, res) => {
    const { cartId, shippingAddress, contactEmail } = req.body;
  const user = await getLoggedInUser(req)
    if (!shippingAddress) throw new AppError(400, "shippingAddress is required");
    if (!cartId) throw new AppError(400, "cartId is required")
    if(!contactEmail) throw new AppError(400, "contactEmail is required");
  // check cart
  const cart = await Cart.findById(cartId); 
  if (!cart) throw new AppError(404, 'cart not found. Please add to cart again');

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
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 5),//expire after 5 hours
    };
    await Order.validate(data);


  // create order
  const order = await Order.create(data);
  
    return res.json({
        status: 'success', 
        message: 'order created with status of PENDING_PAYMENT', 
        orderId: order._id
    })
});

// @route       POST api/orders/paypal/capture-order
// @purpose     Capture order and set status from PENDING_PAYMENT to ORDERED
// @access      public
export const captureOrder = catchASync(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) throw new AppError(400, "orderId is required");
  const order = await Order.findOneAndUpdate(
    { _id: orderId, status: "PENDING_PAYMENT" },
    { $set: { status: "ORDERED", expireAt: null } }, 
    {new: true, runValidators: true}
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
     $or: [{ userId: order.userId?._id }, { userId: req.cookies.tempUserId }],
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
    } \n Check your order status ${order.guestCheckout ? '': 'from your account or'} from here: \n ${
      req.headers.origin
    }/track-order?orderId=${order._id}&email=${order.contactEmail}`;

    // send email to customer
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
  } catch (error) {
  }

  return res.json({
    status: "success",
    message: "order status updated to ORDERED",
    order,
  });
});



// @route       GET api/orders
// @purpose     Get orders via query params
// @access      Admin
export const getAllOrders = catchASync(async (req, res) => {
    let { page = 1, limit = 9999, from, till, id, customer_id, customer_name } = req.query;
    if (id && !mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, "not a valid id");
    if (customer_id && !mongoose.Types.ObjectId.isValid(customer_id)) throw new AppError(400, "not a valid id");
    
    if (!page || !typeof eval(page) === Number)
      throw new AppError(400, "invalid page query. Page must me a number");
    if (!limit || !typeof eval(limit) === Number)
      throw new AppError(400, "invalid limit query. Limit must me a number");

    page = Number(page);
    limit = Number(limit);


    const skip = limit * (page - 1);
    const orders = customer_id
      ? await findOrdersByCustomerId(customer_id, from, till, skip, limit)
      : customer_name
      ? await findOrdersByCustomerName(customer_name, from, till, skip, limit)
      : id
      ? await findOrderByOrderId(id, from, till, skip, limit)
      : from && till
      ? await Order.find({ createdAt: { $gte: from, $lte: till } })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : from
      ? await Order.find({ createdAt: { $gte: from } })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : till
      ? await Order.find({ createdAt: { $lte: till } })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : await Order.find()
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ]);

    return res.json({
      status: "success",
      message: "retrieved all orders",
      page,
      limit,
      from,
      till,
      customer_id,
      customer_name,
      id,
      results: Array.isArray(orders) ? orders.length : orders? 1: 0,
      orders,
    });
})



// @route       PATCH api/orders/:id
// @purpose     UPdate order
// @access      Admin
export const updateOrder = catchASync(async (req, res) => {
  const { status } = req.body; 
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(400, "not a valid id");

  if (!status) throw new AppError(400, 'status is required'); 

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { $set: {status} },
    { new: true, runValidators: true }
  ).populate([
    { path: "userId", model: User },
    {
      path: "items.product",
      model: Product,
      populate: { path: "category", model: Category },
    },
  ]);


  if (!updatedOrder) throw new AppError(404, 'Order not found'); 

  return res.json({
    status: 'success', 
    message: 'order updated', 
    order: updatedOrder
  })
})


// @route       PATCH api/orders/:id
// @purpose     Delete order
// @access      Admin
export const deleteOrder = catchASync(async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(400, "not a valid id");

  const doc = await Order.findByIdAndDelete(id);
  
  if(!doc) throw new AppError(404, 'Order not found')

  return res.json({
    status: 'success', 
    message: 'order deleted'
  })
})



// @route       PUT /api/orders
// @purpose     Delete specific orders
// @access      Admin
export const deleteOrdersById = catchASync(async (req, res) => {
  const { ids } = req.body;
  if (!ids) throw new AppError(400, 'ids is required');

  await Order.deleteMany({ _id: { $in: ids } });
  
  return res.json({
    status: "success",
    message: "orders deleted",
  });
});






