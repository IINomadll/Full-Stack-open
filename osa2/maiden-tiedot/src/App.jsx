import { useState, useEffect } from "react";
import axios from "axios";

// api_key is personal OpenWeatherMap API -key that was set on program launch
const api_key = import.meta.env.VITE_OWM_KEY;

const Display = ({ filteredCountries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const buttonClicked = (country) => setSelectedCountry(country);

  if (selectedCountry) return <DisplaySingle country={selectedCountry} />;

  switch (true) {
    case filteredCountries.length > 10:
      console.log(
        `Too many matches found (${filteredCountries.length}), specify the search`
      );
      return <p>Too many matches, specify the search</p>;
    case filteredCountries.length > 1 && filteredCountries.length <= 10:
      console.log(`${filteredCountries.length} matches found`);
      return (
        <>
          <br />
          {filteredCountries.map((country) => (
            <li style={{ listStyleType: "none" }} key={country.name.official}>
              {country.name.common}&emsp;{/*<- four space gap in text*/}
              <button onClick={() => buttonClicked(country)}>show</button>
            </li>
          ))}
        </>
      );
    case filteredCountries.length === 1: {
      console.log("One country found! Displaying the data");
      const country = filteredCountries[0];
      return <DisplaySingle country={country} />;
    }
    default:
      console.log("Array empty, nothing to display");
      return <p>No countries found, nothing to display</p>;
  }
};

const DisplaySingle = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weather data when the component mounts and when selected country changes
  useEffect(() => {
    const capital = country.capital[0]; // OpenWeatherMap needs a string, not an array

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError("Could not fetch weather data");
        setLoading(false);
      });
  }, [country]);

  // Get all language values from the object
  const languageArr = Object.values(country.languages);

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>
        capital: {country.capital}
        <br />
        area: {country.area} km²
      </p>
      <h3>languages:</h3>
      <ul>
        {languageArr.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}></img>
      <h3>Weather in {country.capital}</h3>
      {loading ? (
        <p>Loading weather...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather description: {weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          ></img>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </>
  );
};

const Filter = ({ search, countries }) => {
  if (search.length > 0) {
    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    console.log("filtered: ", filteredCountries);

    return <Display filteredCountries={filteredCountries} />;
  } else return null;
};

const Search = ({ search, handler }) => {
  return (
    <div>
      find countries <input value={search} onChange={handler}></input>
    </div>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("effect run, fetching countries...");
    // prettier-ignore
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        //console.log(response);
        setCountries(response.data);
      })
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <Search search={search} handler={handleSearchChange} />
      <Filter search={search} countries={countries} />
    </>
  );
}

export default App;
