import {  deleteOrder, updateOrder } from "../../../server/handlers/order";
import authenticate from "../../../server/middleware/authenticate";
import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import ncConfig from "../../../server/utils/ncConfig";
import restrictTo from "../../../server/middleware/restrictTo";

const handler = nc(ncConfig)
  .use(dbConnection, authenticate, restrictTo('ADMIN'))
    .patch(updateOrder)
  .delete(deleteOrder)
export default handler;
