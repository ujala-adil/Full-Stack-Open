import { useState } from 'react'

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      filter shown with<input value={filter} onChange={onChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleOnNameChange} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleOnNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filter, persons }) => {
  return (
    <ul>
      {/* persons.filter((person) => person.name === filter) matches exactly */}
      {persons
        // checks for the string to match targeted string even partially, lowercase for case insensivity
        .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => (
          <Person key={person.id} person={person} />
        ))}
    </ul>
  )
}

const Person = ({ person }) => {
  return (
    <li>{person.name} {person.number}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleOnNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleOnNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleOnFilterChange = (event) => {
    //console.log(event.target.value)
    // const filteredPerson = persons.filter((person) => person.name === event.target.value)
    // console.log(filteredPerson)
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)

    const foundPerson = persons.find((person) => person.name === newName)
    // console.log(foundPerson)

    if (foundPerson) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
      // id: String(persons.length + 1),
      id: persons.length + 1 //keeping the integer type intact as initialized
    }

    setPersons(persons.concat(personObject)) //need to be an object because of the initialization type
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleOnFilterChange} />

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleOnNameChange={handleOnNameChange} handleOnNumberChange={handleOnNumberChange} />

      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} />
    </div>
  )
}

export default App