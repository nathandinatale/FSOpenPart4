const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();

const User = require("../models/user");
const errors = require("../utils/errors");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  if (password.length < 3) {
    next(
      new errors.PasswordTooShortError(
        "Password must be at least 3 characters long"
      )
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
