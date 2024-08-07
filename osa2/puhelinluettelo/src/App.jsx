import { useState } from "react";

const Display = ({ name, number }) => (
  <p>
    {name} | {number}
  </p>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Waltteri Lehtinen", number: "0451234567" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

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

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map((p) => (
        <Display key={p.name} name={p.name} number={p.number} />
      ))}
    </div>
  );
};

export default App;
