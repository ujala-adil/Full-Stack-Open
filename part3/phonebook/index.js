require('dotenv').config()
const express = require('express')
const Person = require('./models/person')


const app = express()

//MIDDLEWARE
app.use(express.static('dist')) //for frontend deployment
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body) //printing during POST and PUT calls
  console.log('---')
  next()
}
app.use(requestLogger)
//MIDDLEWARE


//GET
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`<p>Phonebook has info for ${count} people</p><p> ${new Date()} </p>`)
  });
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

//POST
app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name/number missing'
    })
  }

  const personObj = new Person({
    name: person.name,
    number: person.number
  })

  personObj.save().then(savedPerson => {
    response.json(savedPerson) //saved person is sent back as the response.
  })
    .catch(error => next(error))
})

//PUT
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// DELETE 
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


//MIDDLEWARE
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) // handler of requests with unknown endpoint


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)// handler of requests with result to errors
//MIDDLEWARE


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)