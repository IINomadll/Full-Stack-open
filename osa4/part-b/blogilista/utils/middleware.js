const logger = require("./logger");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  request.token =
    authorization && authorization.startsWith("Bearer ")
      ? authorization.replace("Bearer ", "")
      : null;

  next();
};

const requestLogger = (request, response, next) => {
  logger.info("---");
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
  next();
};

// separate token from request->authorization
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "token missing or invalid" });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
