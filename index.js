require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('dist'))

const requestTime = function (req, res, next) {
  req.requestTime = new Date(Date.now()).toString()
  next()
}
app.use(requestTime)

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(express.json())

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
    mongoose.connection.close()
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  // const newPersonNameAlreadyExists = persons
  //   .map((p) => p.name)
  //   .includes(body.name)
  // const someDataIsMissing = !body.name || !body.number
  //
  // if (someDataIsMissing) {
  //   return response.status(400).json({
  //     error: 'The name or number is missing'
  //   })
  // } else if (newPersonNameAlreadyExists) {
  //   return response.status(400).json({
  //     error: 'The name already exists in the phonebook'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  if (body.name) {
    person.save().then((personAdded) => {
      response.json(personAdded)
    })
  }
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons.findById(id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${request.requestTime}</p>`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
