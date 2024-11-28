import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

// prettier-ignore
export const getAnecdotes = () =>
  axios.get(baseUrl).then((res) => {
    console.log("response data from getAnecdotes: ", res.data);
    return res.data;
  });

export const createAnecdote = (newAnecdote) =>
  axios.post(baseUrl, newAnecdote).then((res) => res.data);

export const updateAnecdote = (updatedAnecdote) => {
  // prettier-ignore
  axios
    .put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
    .then((res) => {
      console.log(res.data);
      return res.data;
    });
};
