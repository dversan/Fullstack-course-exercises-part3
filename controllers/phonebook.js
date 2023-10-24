const phonebookRouter = require('express').Router()
const Person = require('../models/person')

phonebookRouter.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => next(error))
})

phonebookRouter.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === '' || body.number === '') {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then((personAdded) => {
      response.json(personAdded)
    })
    .catch((error) => next(error))
})

phonebookRouter.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

phonebookRouter.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = { name: body.name, number: body.number }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch((error) => next(error))
})

phonebookRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

phonebookRouter.get('/info', (request, response, next) => {
  Person.find({})
    .then((result) =>
      response.send(
        `Phonebook has info for ${result.length} people<br><br>${request._startTime}`
      )
    )
    .catch((error) => next(error))
})

module.exports = phonebookRouter
