import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const obj = { content, votes: 0 }; // backend creates id
  const response = await axios.post(baseUrl, obj);
  return response.data;
};

const vote = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  const anecdoteToVote = response.data;
  const updated = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 };

  const updatedResponse = await axios.put(`${baseUrl}/${id}`, updated);
  return updatedResponse.data;
};

export default { getAll, createNew, vote };
