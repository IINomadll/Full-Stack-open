import { useState } from "react";

const Button = (props) => (
  <button onClick={() => props.method(props.value + 1)}>{props.name}</button>
);

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const avg = (good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad);
  const positive = (good / (good + neutral + bad)) * 100;

  return (
    <>
      <p>all {all}</p>
      <p>average {avg}</p>
      <p>positive {positive} %</p>
    </>
  );
};
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
        {good + neutral + bad < 1 ? (
          <p>No feedback given</p>
        ) : (
          <>
            <h1>statistics</h1>
            <p>good {good}</p>
            <p>neutral {neutral}</p>
            <p>bad {bad}</p>
            <Statistics good={good} neutral={neutral} bad={bad} />
          </>
        )}
      </div>
    </>
  );
};

export default App;
