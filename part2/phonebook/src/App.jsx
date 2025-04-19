import { useState } from 'react'

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

    setPersons(persons.concat({ name: newName, number: newNumber })) //need to wrap it in an object
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with<input value={filter} onChange={handleOnFilterChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleOnNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleOnNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {/* persons.filter((person) => person.name === filter) matches exactly */}
        {persons
        // checks for the string to match targeted string even partially, lowercase for case insensivity
          .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
          .map((person) => (
            <li key={person.id}>{person.name} {person.number}</li>
          ))}
      </ul>
    </div>
  )
}

export default App