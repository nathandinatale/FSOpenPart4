const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");

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

app.use("/api/blogs", blogsRouter);

process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => {
      console.log("Mongoose connection closed");
      process.exit();
    })
    .catch((error) => {
      console.log("issue when closing mongoose connection", error);
      process.exit();
    });
});

module.exports = app;
