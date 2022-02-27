import {
  updateCategory,
  deleteCategory,
} from "../../../server/handlers/category";

import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig).use(dbConnection)
  .patch(updateCategory)
  .delete(deleteCategory);

export default handler;