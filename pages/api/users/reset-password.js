import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import { resetPassword } from "../../../server/handlers/users";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig)
  .use(dbConnection)
  .post(resetPassword)

export default handler;
