const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://daversan:${password}@cluster0.y5ll2.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv[4]) {
  person.save().then((result) => {
    console.log('Person saved!')
    mongoose.connection.close()
  })
}

Person.find({}).then((persons) => {
  console.log(`phonebook:\n ${persons.map((p) => `${p.name} ${p.number}\n`)}`)
  mongoose.connection.close()
})
