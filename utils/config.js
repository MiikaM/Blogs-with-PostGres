require('dotenv').config()

let PORT = process.env.PORT || "8080";
let DATABASE_URL = process.env.DATABASE_URL
let SECRET = process.env.SECRET;
if (process.env.NODE_ENV === 'test') {
  DATABASE_URL = process.env.TEST_DATABASE_URL
}

module.exports = {
  DATABASE_URL,
  PORT,
  SECRET
}