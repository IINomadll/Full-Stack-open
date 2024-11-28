import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

// const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = (anecdote) => ({
//   content: anecdote,
//   id: getId(),
//   votes: 0,
// });

const initialState = [];

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    updateAnecdote(state, action) {
      const id = action.payload.id;
      return state.map((a) => (a.id === id ? action.payload : a));
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { updateAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

// redux thunk async action
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

// redux thunk async action
export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

// redux thunk async action
export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const voted = await anecdoteService.vote(id);
    dispatch(updateAnecdote(voted));
  };
};

export default anecdoteSlice.reducer;
