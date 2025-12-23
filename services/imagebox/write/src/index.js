import app from "./app.js";
import registerWithConsul from "./configs/consul-config.js";
import DB from "./db/db.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

DB()
  .then(() => {
    app.listen(9000, () => {
      registerWithConsul(9000), logger.trace("_ok write-imagebox-write 9000");
    });
  })
  .catch((error) => {
    logger.fatal({ error }, "_F write-imagebox-write 9000");
    process.exit(1);
  });
