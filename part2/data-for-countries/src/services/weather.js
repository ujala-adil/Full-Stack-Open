import axios from 'axios'

const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (lat, lon) => { //(capital)
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

    const request = axios.get(url)
    return request.then(response => response.data)

}

export default { getWeather }
