import { useState, useEffect } from "react";
import axios from "axios";

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
        {languageArr.map((value, index) => {
          console.log(value);
          return <li key={index}>{value}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}></img>
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
