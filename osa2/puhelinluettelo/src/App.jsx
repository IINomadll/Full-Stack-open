import { useState, useEffect } from "react";
import axios from "axios";

const Display = ({ persons, search }) => {
  const filteredPersons =
    search.length > 0
      ? persons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : persons;

  return (
    <>
      {filteredPersons.map((p) => (
        <p key={p.name}>
          {p.name} | {p.number}
        </p>
      ))}
    </>
  );
};

const Filter = ({ search, handler }) => (
  <div>
    filter shown with <input value={search} onChange={handler} />
  </div>
);

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.nameHandler} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.numberHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault(); // prevent default actions like page reload
    console.log("button clicked", event.target);
    const personObj = {
      name: newName,
      number: newNumber,
    };

    const found = persons.find(
      (element) => element.name.toLowerCase() === newName.toLowerCase()
    );
    console.log("FOUND", found);

    if (found) {
      console.log(`${newName} is already added to phonebook`);
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObj)); // add new person to persons array
      setNewName(""); // clear input field after submit
      setNewNumber(""); // --||--
    }
  };

  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  return (
    <>
      <h2>Phonebook</h2>
      <Filter search={search} handler={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
      />
      <h2>contacts</h2>
      <Display persons={persons} search={search} />
    </>
  );
};

export default App;
