import app from "./app.js";
import registerWithConsul from "./configs/consul-config.js";
import authDB from "./db/auth-db.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 6000;

authDB()
  .then(() => {
    app.listen(port, () => {
      registerWithConsul(8001);
      logger.trace("_ok auth-imagebox-auth 8001");
    });
  })
  .catch((error) => {
    logger.fatal({ error }, "_F auth-imagebox-auth 8001");
    process.exit(1);
  });
