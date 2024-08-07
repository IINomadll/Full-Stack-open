import { useState } from "react";

const Display = ({ name }) => <p>{name}</p>;

const App = () => {
  const [persons, setPersons] = useState([{ name: "Waltteri Lehtinen" }]);
  const [newName, setNewName] = useState("");

  const addName = (event) => {
    event.preventDefault();
    console.log("button clicked", event.target);
    const nameObj = {
      name: newName,
    };

    const found = persons.find(
      (element) => element.name.toLowerCase() === newName.toLowerCase()
    );
    console.log("FOUND", found);

    if (found) {
      console.log(`${newName} is already added to phonebook`);
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(nameObj)); // add new name to persons arr
      setNewName(""); // empty input field after submit
    }
  };

  const handleNameChange = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((p) => (
        <Display key={p.name} name={p.name} />
      ))}
    </div>
  );
};

export default App;
