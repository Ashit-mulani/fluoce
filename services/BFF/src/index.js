import app from "./app.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(8000, () => {
  logger.trace("_ok imagebox-BFF 8000");
});
