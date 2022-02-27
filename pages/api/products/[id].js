import nc from "next-connect";
import multer from "multer";
import dbConnection from "../../../server/middleware/dbConnection";
import restrictTo from "../../../server/middleware/restrictTo";
import {
  deleteProduct,
  updateProduct,
} from "../../../server/handlers/products";
import authenticate from "../../../server/middleware/authenticate";
import ncConfig from "../../../server/utils/ncConfig";


const handler = nc(ncConfig)
  .use(dbConnection, authenticate, restrictTo("ADMIN"))
  .patch(
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }).array("image", 10),
    updateProduct
  )
  .delete(deleteProduct);

export default handler;



export const config = {
  api: {
    bodyParser: false,
  },
};