const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', ['name', 'username', 'id'])
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const findUser = async () => {
    if (body.userId) {
      await User.findById(body.userId)
    } else {
      const users = await User.find({})
      return users[0]
    }
  }

  const user = await findUser()

  console.log(user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  response.json(savedBlog)
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).json(result)
    })
    .catch((error) => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((result) => {
      response.status(201).json(result)
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
