const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/api/users', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  if (password.length >= 3) {
    const savedUser = await user.save().catch((error) => {
      response.status(400)
      response.send(error.message)
    })
    response.status(201).json(savedUser)
  } else {
    return response.status(400).json({
      error: 'Password is shorter than the minimum allowed length (3)'
    })
  }
})

module.exports = userRouter
