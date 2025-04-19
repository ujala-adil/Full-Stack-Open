import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const handleOnChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    // setPersons(persons.concat(newName))
    setPersons(persons.concat({ name: newName })) //need to wrap it in an object
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleOnChange} />
        </div>
        <div>debug: {newName}</div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {/* {persons.map((person, index) => {
          return <li key={index}>{person.name}</li>
        })} */}

        {persons.map((person) => (
            <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App