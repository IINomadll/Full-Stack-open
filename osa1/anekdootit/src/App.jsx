import { useState } from "react";

const Display = ({ anecdote }) => <div>{anecdote}</div>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const anecdotesLength = anecdotes.length;
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotesLength).fill(0));

  const getRandomInt = (max) => {
    const rand = Math.floor(Math.random() * max);
    console.log("rand ", rand);
    return rand;
  };

  const mostVoted = () => {
    let indexOfMax = points.reduce(
      (maxIndex, currentValue, currentIndex, points) => {
        return currentValue > points[maxIndex] ? currentIndex : maxIndex;
      },
      0
    );

    console.log("index of most voted: ", indexOfMax);
    return indexOfMax;
  };

  const handleRandomInt = () => setSelected(getRandomInt(anecdotesLength));

  const handleVote = () => {
    const copy = [...points];
    copy[selected] += 1;
    console.log(`points array: ${copy}`);
    setPoints(copy);
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <Display anecdote={anecdotes[selected]} />
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={handleRandomInt} text="next anecdote" />
      <h1>Anecdote with most votes</h1>
      <Display anecdote={anecdotes[mostVoted()]} />
    </>
  );
};

export default App;
