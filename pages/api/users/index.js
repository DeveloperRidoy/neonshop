import nc from "next-connect";
import multer from "multer";
import dbConnection from "../../../server/middleware/dbConnection";
import {
  getAllUsers, updateMe,
} from "../../../server/handlers/users";
import authenticate from "../../../server/middleware/authenticate";
import ncConfig from "../../../server/utils/ncConfig";

const handler = nc(ncConfig)
  .use(dbConnection)
  .get(getAllUsers)
  .patch(
    authenticate,
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }).single("image"),
    updateMe
  );

export default handler; 


export const config = {
  api: {
    bodyParser: false,
  },
};
