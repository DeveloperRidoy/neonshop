import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import authenticate from "../../../server/middleware/authenticate";
import {
  deleteMe
} from "../../../server/handlers/users";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig).use(dbConnection, authenticate).put(deleteMe);

export default handler;
