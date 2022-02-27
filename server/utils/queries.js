import Category from "../models/category";
import Order from "../models/order";
import Product from "../models/product";
import User from "../models/user";

export const findOrdersByCustomerName = async (customer_name, from,till, skip, limit) => {
  const userIdObjList = await User.find({
    $or: [
      { firstName: new RegExp(String(customer_name).trim(), "i") },
      { lastName: new RegExp(String(customer_name).trim(), "i") },
    ],
  }).select({ _id: 1 });
  const userIds = userIdObjList.map((obj) => obj._id);
  const orders =
    customer_name && from && till
      ? await Order.find({
          userId: { $in: userIds },
          createdAt: { $gte: from, $lte: till },
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : customer_name && from
      ? await Order.find({
          userId: { $in: userIds },
          createdAt: { $gte: from },
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : customer_name && till
      ? await Order.find({
          userId: { $in: userIds },
          createdAt: { $lte: till },
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : await Order.find({
          userId: { $in: userIds },
        })
          .skip(skip)
          .limit(limit)
          .lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ]);
  return orders;
};


export const findOrdersByCustomerId = async (customer_id, from,till, skip, limit) => {
    const orders =
      customer_id && from && till
        ? await Order.find({
            userId: customer_id,
            createdAt: { $gte: from, $lte: till },
          })
            .skip(skip)
            .limit(limit)
            .lean()
            .populate([
              { path: "userId", model: User },
              { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
            ])
        : customer_id && from
        ? await Order.find({
            userId: customer_id,
            createdAt: { $gte: from },
          })
            .skip(skip)
            .limit(limit)
            .lean()
            .lean()
            .populate([
              { path: "userId", model: User },
              { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
            ])
        : customer_id && till
        ? await Order.find({
            userId: customer_id,
            createdAt: { $lte: till },
          })
            .skip(skip)
            .limit(limit)
            .lean().lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
        : await Order.find({
            userId: customer_id,
          })
            .skip(skip)
            .limit(limit)
            .lean().lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ]); 
    
    return orders;
}
 

export const findOrderByOrderId = async (
  id,
  from,
 till,
  skip,
  limit
) => {
  const order =
    id && from && till
      ? await Order.find({
          _id: id,
          createdAt: { $gte: from, $lte: till },
        })
          .skip(skip)
          .limit(limit)
          .lean().lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : id && from
      ? await Order.find({
          _id: id,
          createdAt: { $gte: from },
        })
          .skip(skip)
          .limit(limit)
          .lean().lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : id && till
      ? await Order.find({
          _id: id,
          createdAt: { $lte: till },
        })
          .skip(skip)
          .limit(limit)
          .lean().lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ])
      : await Order.find({
          _id: id,
        })
          .skip(skip)
          .limit(limit)
          .lean().lean()
          .populate([
            { path: "userId", model: User },
            { path: "items.product", model: Product, populate: {path: 'category', model: Category} },
          ]);

  return order;
};
 

