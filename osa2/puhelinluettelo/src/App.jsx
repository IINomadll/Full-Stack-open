import { useState, useEffect } from "react";
import personService from "./services/persons";

const Display = ({ persons, search, deletePerson }) => {
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
          {p.name} | {p.number}{" "}
          <button onClick={() => deletePerson(p.id, p.name)}>delete</button>
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
    // prettier-ignore
    personService
      .getAll()
      .then((response) => {
        console.log("promise fulfilled");
        setPersons(response.data);
    });
  }, []);

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
      // prettier-ignore
      personService
        .create(personObj)
        .then(response => {
          console.log(response);
          setPersons(persons.concat(response.data));
        });
      setNewName(""); // clear input field after submit
      setNewNumber(""); // --||--
    }
  };

  const deletePerson = (id, name) => {
    console.log(`delete button clicked for id ${id}`);
    const choice = window.confirm(`Delete ${name}?`);

    if (choice) {
      // prettier-ignore
      personService
      .eradicate(id)
      .then(response => {
        console.log(response);
        setPersons(persons.filter(p => p.id !== id));
      });
    } else console.log("Delete action cancelled.");
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
      <Display persons={persons} search={search} deletePerson={deletePerson} />
    </>
  );
};

export default App;
