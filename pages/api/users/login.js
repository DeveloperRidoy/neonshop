import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import {login} from "../../../server/handlers/users";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig)
  .use(dbConnection)
  .post(login)

export default handler;
