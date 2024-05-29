import { useState } from "react";

const Button = (props) => (
  <button onClick={() => props.method(props.value + 1)}>{props.name}</button>
);

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <Button name="good" method={setGood} value={good} />
        <Button name="neutral" method={setNeutral} value={neutral} />
        <Button name="bad" method={setBad} value={bad} />
        <h1>statistics</h1>
        <p>good {good}</p>
        <p>netral {neutral}</p>
        <p>bad {bad}</p>
      </div>
    </>
  );
};

export default App;
