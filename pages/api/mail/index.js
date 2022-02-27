import {
    sendEmail
} from "../../../server/handlers/mail";
import nc from "next-connect";
import dbConnection from "../../../server/middleware/dbConnection";
import ncConfig from "../../../server/utils/ncConfig";
import multer from "multer";

const handler = nc(ncConfig)
  .use(
    dbConnection,
  )
  .post(multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }).single("image"), sendEmail);

export default handler;


export const config = {
  api: {
    bodyParser: false
  }
}