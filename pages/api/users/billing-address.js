import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import authenticate from "../../../server/middleware/authenticate";
import { addBillingAddress, updateBillingAddress } from "../../../server/handlers/users";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig)
  .use(dbConnection, authenticate)
  .post(addBillingAddress)
  .patch(updateBillingAddress);

export default handler;
