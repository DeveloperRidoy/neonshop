import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import ncConfig from "../../../server/utils/ncConfig";
import { webhookCheckout } from "../../../server/handlers/stripe/webhookCheckout";

const handler = nc(ncConfig).use(dbConnection).post(webhookCheckout);

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
