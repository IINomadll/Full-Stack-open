import { useState } from "react";

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

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Waltteri Lehtinen", number: "045-1234567" },
    { name: "Scarlett Johansson", number: "040-1234567" },
    { name: "Sydney Sweeney", number: "050-1234567" },
    { name: "Emilia Clarke", number: "046-1234567" },
    { name: "Jarskibastian Lehtipihvinen", number: "055-1234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

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
    <div>
      <h2>Phonebook</h2>
      <div>
        filer shown with <input value={search} onChange={handleSearchChange} />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>contacts</h2>
      <Display persons={persons} search={search} />
    </div>
  );
};

export default App;
