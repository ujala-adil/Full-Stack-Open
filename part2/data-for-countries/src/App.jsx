import { useState, useEffect } from 'react'
import countryService from './services/countries'
import './index.css'

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      find countries<input value={filter} onChange={onChange} />
    </div>
  )
}

const Countries = ({ filter, countries }) => {
  let filteredCountries = countries.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  if (filteredCountries === '') {
    return null
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />
  }

  return (
    <ul>
      {filteredCountries.map((country) => (
        <li key={country.cca3}>{country.name.common}</li>
      ))}
    </ul>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
    </div>
  )
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleOnFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} onChange={handleOnFilterChange} />

      <h2>Countries:</h2>
      <Countries filter={filter} countries={countries} />
    </div>
  )
}

export default App