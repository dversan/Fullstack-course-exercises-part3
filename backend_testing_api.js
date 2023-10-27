const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
mongoose.connect(process.env.TEST_MONGODB_URI)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  author: process.argv[2],
  title: process.argv[3],
  url: process.argv[4],
  likes: process.argv[5]
})

if (process.argv[2] && process.argv[3] && process.argv[4] && process.argv[5]) {
  blog.save().then((result) => {
    console.log('Blog saved!')
    mongoose.connection.close()
  })
} else {
  console.log('Some content is missing')
}
