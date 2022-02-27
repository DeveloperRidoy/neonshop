import {
  addCategory, getAllCategories
} from "../../../server/handlers/category";
import authenticate from "../../../server/middleware/authenticate";
import restrictto from '../../../server/middleware/restrictTo';
import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import ncConfig from "../../../server/utils/ncConfig";


const handler = nc(ncConfig)
  .use(dbConnection)
  .get(getAllCategories)
  .post(authenticate, restrictto('ADMIN'),addCategory)

export default handler;
