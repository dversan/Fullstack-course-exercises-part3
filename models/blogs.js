const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'title required'] },
  author: { type: String, required: [true, 'author required'] },
  url: { type: String, required: [true, 'url required'] },
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
