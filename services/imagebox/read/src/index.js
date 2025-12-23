import app from "./app.js";
import registerWithConsul from "./configs/consul-config.js";
import DB from "./db/db.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

DB()
  .then(() => {
    app.listen(9001, () => {
      registerWithConsul(9001), logger.trace("_ok read-imagebox-read 9001");
    });
  })
  .catch((error) => {
    logger.fatal({ error }, "_F read-imagebox-read 9001");
    process.exit(1);
  });
