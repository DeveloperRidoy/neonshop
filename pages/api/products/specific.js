import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import restrictTo from "../../../server/middleware/restrictTo";
import { deleteSpecificProducts } from "../../../server/handlers/products";
import authenticate from "../../../server/middleware/authenticate";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig)
  .use(dbConnection, authenticate, restrictTo("ADMIN"))
  .put(deleteSpecificProducts);

export default handler;
