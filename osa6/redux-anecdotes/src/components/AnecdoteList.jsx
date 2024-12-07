import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { notifier } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "ALL") {
      return anecdotes;
    }

    return anecdotes.filter((a) =>
      a.content.toLowerCase().includes(filter.toLowerCase())
    );
  });
  const dispatch = useDispatch();

  const handleVote = (id) => {
    console.log("vote", id);
    const voted = anecdotes.find((a) => a.id === id);
    dispatch(voteAnecdote(id));
    dispatch(notifier(`you voted "${voted.content}"`, 5));
  };

  // sorting anecdotes in descending order using spreading to maintain
  // immutibility of original anecdotes array
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
