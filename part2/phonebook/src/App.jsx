import { useState, useEffect } from 'react'
// import axios from 'axios'
import personService from './services/contacts'
import './index.css'


const Filter = ({ filter, onChange }) => {
  return (
    <div>
      filter shown with<input value={filter} onChange={onChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addUpdatePerson}>
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
          <Person key={person.id} person={person} deletePerson={() => deletePerson(person)} />
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

const Notification = ({ message, nameOfClass }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={nameOfClass}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setMessage] = useState(null)
  const [className, setClassName] = useState(null)

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

  const addUpdatePerson = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)

    const foundPerson = persons.find((person) => person.name === newName)
    // console.log(foundPerson)

    if (foundPerson) {
      // alert(`${newName} is already added to phonebook`)
      // return

      const ifUpdate = window.confirm(`${foundPerson.name} is already added to the phonebook, replace the old number with a new one?`);

      if (ifUpdate) {
        const updatedPerson = { ...foundPerson, number: newNumber } //All fields are copied from foundPerson, but number is replaced with the new value.

        personService
          .updateNumber(foundPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === returnedPerson.id ? returnedPerson : p)) //p.id === returnedPerson.id, it means this is the person we updated So it replaces p with returnedPerson (the updated data from the server). Otherwise, it keeps p as is. This creates a new updated array and sets it as the new persons state.
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setClassName('error')
            setMessage(
              `Information of ${updatedPerson.name} has already been removed from the server`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          });
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        // id: persons.length + 1 //keeping the integer type intact as initialized
        // //no need to add id manually as adding to server automatically appends the id property to the added object.
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setClassName('success')
          setMessage(
            `Added ${returnedPerson.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (contact) => {
    // console.log("Delete button clicked for id:", contact.id)
    const confirmDelete = window.confirm(`Delete ${contact.name}?`);

    if (confirmDelete) {
      personService.deletePerson(contact.id)
        .then(setPersons(persons.filter(person => person.id !== contact.id)));
      //filter returns a new array which is the changed one based on the condition inside.
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} nameOfClass={className} />
      <Filter filter={filter} onChange={handleOnFilterChange} />

      <h2>add a new</h2>
      <PersonForm addUpdatePerson={addUpdatePerson} newName={newName} newNumber={newNumber} handleOnNameChange={handleOnNameChange} handleOnNumberChange={handleOnNumberChange} />

      <h2>Numbers</h2>
      <Persons filter={filter} persons={persons} deletePerson={deletePerson} />
    </div>
  )
}

export default App