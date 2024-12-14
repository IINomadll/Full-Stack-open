require("dotenv").config();

console.log("Current NODE_ENV:", process.env.NODE_ENV);

let PORT = process.env.PORT;
let MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
