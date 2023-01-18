import axios from "axios"
import { useState } from "react"
import "./style.scss"
const apiKey = process.env.REACT_APP_KEY

function App() {
  //?State
  const [data, setData] = useState({})
  const [cityNames, setCityNames] = useState({})
  const [cities, setCities] = useState([])
  const [input, setInput] = useState("")
  const [geo, setGeo] = useState({
    name: "",
    units: true,
  })

  //? Axios callers
  const getCities = name => {
    if (name !== "" && name.length >= 1) {
      try {
        axios
          .get(
            `https://api.openweathermap.org/geo/1.0/direct?q=${name.toLowerCase()}&limit=3&appid=${apiKey}`
          )
          .then(res => {
            setCities(res.data)
          })
      } catch (err) {
        console.log(err)
      }
    } else {
      setCities([])
      return
    }
  }

  const getWeather = (lat, lon, cityName, cityState) => {
    setCityNames({})
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${
          geo.units ? "imperial" : "metric"
        }`
      )
      .then(res => {
        setCityNames({ name: cityName, state: cityState })
        setCities([])
        setInput("")
        setData(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  //! Functions

  const getTime = time => {
    const unix_timestamp = time
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(unix_timestamp * 1000)
    // Hours part from the timestamp
    const hours = date.getHours()
    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes()
    // Will display time in 10:30:23 format
    const formattedTime = hours + ":" + minutes.substr(-2)

    return formattedTime
  }

  const handleUnits = () => {
    setGeo({ ...geo, units: !geo.units })
  }

  //? Components

  const minorPairing = (style, first, second) => {
    const arr = [first, second]
    return (
      <div className={style}>
        {arr.map(x => {
          return (
            <div title={`${x.title}`}>
              <i className={`fa-solid fa-${x.icon}`} />
              <span>{x.data}</span>
              {x.unit}
            </div>
          )
        })}
      </div>
    )
  }

  const searchBar = () => {
    return (
      <div className="search">
        <input
          required
          value={input}
          type="text"
          onChange={e => {
            setInput(e.target.value)
            getCities(e.target.value)
          }}
        />
        <span>Pick a city...</span>
        {cities && cities.length > 1 ? (
          <div className="search-results">
            {cities.map((c, i) => {
              const result = `${c.name}${
                c.state && c.name !== c.state ? `, ${c.state}` : ""
              }`.substring(0, 27)
              return (
                <div
                  className="search-result"
                  key={c.name + c.state + i}
                  onClick={() => getWeather(c.lat, c.lon, c.name, c.state)}
                >
                  {result.length > 25 ? result + "..." : result}
                </div>
              )
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }

  const UnitButton = () => {
    return (
      <div className="button">
        <button
          className="change-units"
          title="Change Units"
          onClick={handleUnits}
        >
          {geo.units ? "Metric" : "Imperial"} units
        </button>
      </div>
    )
  }

  const MainInfo = () => {
    return (
      <div className="info">
        <span className="city-name">{cityNames?.name}</span>
        {cityNames.name !== cityNames.state && (
          <span className="city-name">{cityNames?.state}</span>
        )}
        <span className="current-temp">{`${data?.main.temp} ${
          geo.units ? "°F" : "°C"
        }`}</span>
      </div>
    )
  }

  const WeatherIcon = () => {
    return (
      <div className="type-icon">
        <span className="weather-main">{data.weather[0]?.main}</span>
        <img
          title={data.weather[0]?.main}
          src={`http://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
          alt="Weather Icon"
        />
      </div>
    )
  }

  const loader = () => {
    return (
      <div className="loader">
        <i className="fa-solid fa-cloud-sun" />
        <h1>Weather My City?</h1>
        {searchBar()}
      </div>
    )
  }

  //! Component Data
  const compParams = {
    sunrise: {
      title: "Sunrise",
      icon: "sun",
      data: getTime(data.sys?.sunrise),
      unit: " AM",
    },
    sunset: {
      title: "Sunset",
      icon: "moon",
      data: getTime(data.sys?.sunset),
      unit: " PM",
    },
    humid: {
      title: "Humidity",
      icon: "droplet",
      data: data.main?.humidity,
      unit: " %",
    },
    wind: {
      title: "Wind",
      icon: "wind",
      data: data.wind?.speed,
      unit: geo.units ? " mph" : " kmh",
    },
    hiTemp: {
      title: "Hi-Temp",
      icon: "temperature-arrow-up",
      data: data.main?.temp_max,
      unit: geo.units ? " °F" : " °C",
    },
    lowTemp: {
      title: "Low-Temp",
      icon: "temperature-arrow-down",
      data: data.main?.temp_min,
      unit: geo.units ? " °F" : " °C",
    },
  }

  //? Return
  return (
    <div className="App">
      {data.main ? (
        <div className="main ">
          <div className="major-conditions">
            <UnitButton />
            <MainInfo />
            <WeatherIcon />
          </div>
          <div className="search-container">{searchBar()}</div>
          <div className="minor-conditions">
            {minorPairing("left minor", compParams.sunrise, compParams.sunset)}
            {minorPairing("center minor", compParams.humid, compParams.wind)}
            {minorPairing("right minor", compParams.hiTemp, compParams.lowTemp)}
          </div>
        </div>
      ) : (
        loader()
      )}
      <div className="footer">
        <p className="credit">
          <a href="https://savcodes.dev">Sav Costabile</a>&nbsp;© 2022
        </p>
      </div>
    </div>
  )
}

export default App
