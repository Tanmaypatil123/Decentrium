const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  infura: process.env.INFURA,
  memonic: process.env.META,
  add: process.env.ADDRESS
};