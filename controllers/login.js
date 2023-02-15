const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");
const config = require("../utils/config");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  if (!user) return logger.error("User not found");

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) return logger.error("Incorrect password");

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, config.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
