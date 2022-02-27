import {
    addOrUpdateCart, 
    getCart, 
    deleteCart,
    updateCart,
    addToCart
} from "../../../server/handlers/cart";
import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig)
  .use(dbConnection)
  .get(getCart)
    .post(addToCart)
    .patch(updateCart)
    .delete(deleteCart);

export default handler;
