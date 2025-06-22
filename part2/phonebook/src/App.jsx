import { useState, useEffect } from 'react'
// import axios from 'axios'
import personService from './services/contacts'

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

const Persons = ({ filter, persons, deletePerson }) => {
  return (
    <ul>
      {/* persons.filter((person) => person.name === filter) matches exactly */}
      {persons
        // checks for the string to match targeted string even partially, lowercase for case insensivity
        .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => (
          <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)} />
        ))}
    </ul>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number} <DeleteButton deletePerson={deletePerson} />
    </li>
  )
}

const DeleteButton = ({ deletePerson }) => {
  return <button onClick={deletePerson}>delete</button>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // console.log('render', persons.length, 'persons')


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

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {
    console.log("Delete button clicked for id:", id)
    personService.deletePerson(id)
      .then(setPersons(persons.filter(person => person.id !== id))); //filter returns a new array which is the changed one based on the condition inside.
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleOnFilterChange} />

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleOnNameChange={handleOnNameChange} handleOnNumberChange={handleOnNumberChange} />

      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} deletePerson={deletePerson} />
    </div>
  )
}

export default App