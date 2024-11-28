import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "../requests";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const queryClient = useQueryClient();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      setTimeout(() => { // little timeout to counter timing issue with server
        queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      }, 100);
    },
  });

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  if (result.isLoading) return <div>loading data...</div>;
  if (result.isError)
    return (
      <div>anecdote service not available due to problems with server</div>
    );

  const anecdotes = result.data;

  const handleVote = (anecdote) => {
    console.log(`vote ${anecdote.id}`);
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
