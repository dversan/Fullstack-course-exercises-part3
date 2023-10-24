require('dotenv').config()

const PORT = 3003
const MONGODB_URI = process.env.MONGODB_BLOGS_URI

module.exports = {
  MONGODB_URI,
  PORT
}
