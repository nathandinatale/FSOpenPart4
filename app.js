const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testing");

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error(
      "Something went wrong when connecting to MongoDB",
      error.message
    );
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/testing", testingRouter);
app.use(middleware.errorHandler);

process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => {
      logger.info("Mongoose connection closed");
      process.exit();
    })
    .catch((error) => {
      logger.error("issue when closing mongoose connection", error);
      process.exit();
    });
});

module.exports = app;
