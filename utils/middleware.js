const jwt = require("jsonwebtoken");

const logger = require("./logger");
const config = require("./config");
const User = require("../models/user");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "token missing or invalid" });
  }
  next(error);
};

const userExtractor = async (request, response, next) => {
  const providedToken = request.token;
  if (!providedToken)
    return response
      .status(401)
      .send({ error: "No token provided this action is unauthorized" });

  let user = null;

  try {
    const decodedToken = jwt.verify(providedToken, config.SECRET);
    user = await User.findById(decodedToken.id);
  } catch (exception) {
    return next(exception);
  }

  if (!user)
    return response
      .status(404)
      .send({ error: "User associated to this token could not be found" });

  request.user = user;
  next();
};

module.exports = { tokenExtractor, errorHandler, userExtractor };
