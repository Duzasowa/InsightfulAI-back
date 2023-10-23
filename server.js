import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./utils/Logger.js";

dotenv.config({ path: "./config.env" });

// Uploading a password to the database
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

console.log(DB);

// Connect to database
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => logger.info("DB connected successfully"))
  .catch((err) => logger.error(`DB connection error: ${err.message}`));

const PORT = process.env.PORT;
// Switching the server operation mode
const isProduction = process.env.NODE_ENV === "production";

(async () => {
  try {
    if (isProduction) {
      const httpsServer = https.createServer(
        {
          key: fs.readFileSync("privkey.pem"),
          cert: fs.readFileSync("fullchain.pem"),
        },
        app
      );
      httpsServer.listen(PORT, () => {
        logger.info(`PROD server started on port ${PORT}`);
      });
    } else {
      app.listen(PORT, () => {
        logger.info(`DEV server started on port ${PORT}`);
      });
    }
  } catch (error) {
    logger.error(error);
  }
})();
