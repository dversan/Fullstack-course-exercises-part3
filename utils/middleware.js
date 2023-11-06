const logger = require('./logger')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'wrong id format' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const authUserIdExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (decodedToken.id) {
      request.authUserId = decodedToken.id
      next()
    } else {
      response.status(401).json({ error: 'token invalid' })
      next()
    }
  } else {
    next()
  }
}

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  authUserIdExtractor
}
