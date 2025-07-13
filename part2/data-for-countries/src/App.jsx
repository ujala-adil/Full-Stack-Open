import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import './index.css'

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      find countries<input value={filter} onChange={onChange} />
    </div>
  )
}

const Countries = ({ filter, countries, showCountry }) => {
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
        <li key={country.cca3}>{country.name.common} <ShowButton showCountry={() => showCountry(country)} /></li>
      ))}
    </ul>
  )
}

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
      .getWeather(country.latlng[0], country.latlng[1])
      .then(initialWeather => setWeather(initialWeather))
  }, [country.latlng])

  // useEffect(() => {
  //   weatherService
  //     .getWeather(country.capital[0])
  //     .then(initialWeather => setWeather(initialWeather))
  // }, [country.capital])

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

      {weather ?
        <>
          <h2>Weather in {country.capital[0]}</h2>
          <p>Temperature {weather.main.temp} Celsius</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind {weather.wind.speed} m/s</p>
        </>
        :
        null
      }

    </div>
  )
}

const ShowButton = ({ showCountry }) => {
  return <button onClick={showCountry}>Show</button>
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleOnFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <Filter filter={filter} onChange={handleOnFilterChange} />

      <Countries filter={filter} countries={countries} showCountry={showCountry} />
      {selectedCountry && <Country country={selectedCountry} />}
    </div>
  )
}

export default App