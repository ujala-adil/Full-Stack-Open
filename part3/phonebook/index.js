require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')


const app = express()

//MIDDLEWARE
app.use(express.json())

// app.use(morgan('tiny'));
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist')) //for frontend deployment
//MIDDLEWARE



let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

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
app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name/number missing'
    })
  }
  else if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const personObj = new Person({
    name: person.name,
    number: person.number
  })

  personObj.save().then(savedPerson => {
    response.json(savedPerson) //saved person is sent back as the response.
  })
})


// DELETE 
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)