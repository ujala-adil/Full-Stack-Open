const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

// app.use(morgan('tiny'));
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const cors = require('cors')
app.use(cors())



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


//GET
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p> ${new Date()} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


const generateId = () => {
  return Math.floor(Math.random() * 1000000);
}

//POST
app.post('/api/persons', (request, response) => {
  const person = request.body
  // console.log(person)

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name/number missing'
    })
  }
  else if (persons.find(p => p.name === person.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const personObj = {
    name: person.name,
    number: person.number,
    id: generateId(),
  }

  persons = persons.concat(personObj) //missing this line does not reflect the added person on the server

  response.json(personObj) //this only sends the data back to the client (e.g. browser or Postman)
})


// DELETE 
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)