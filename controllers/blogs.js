const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', ['name', 'username', 'id'])
  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.authUserExtractor,
  async (request, response) => {
    const body = request.body
    const authUserId = request.authUser.id

    const user = await User.findById(authUserId)

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
  }
)

blogsRouter.delete(
  '/:id',
  middleware.authUserExtractor,
  async (request, response, next) => {
    const authUserId = request.authUser.id
    const blog = await Blog.findById(request.params.id)
    const userId = blog.user.toString()

    if (authUserId === userId) {
      Blog.findByIdAndRemove(request.params.id)
        .then((result) => {
          response.status(204).json(result)
        })
        .catch((error) => next(error))
    } else {
      response
        .status(401)
        .json({ error: 'user is not authorized to delete this blog' })
    }
  }
)

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
