import { createContext, useContext, useReducer } from "react";

// reducer function to handle state changes
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload; // return the user object
    case "LOGOUT":
      return null; // no user logged in
    default:
      return state;
  }
};

// create the User context
const UserContext = createContext();

// context provider component
export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(reducer, null);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

// custom hook to access user state
export const useUserValue = () => {
  const { user } = useContext(UserContext);
  return user;
};

// custom hook to access user dispatch
export const useUserDispatch = () => {
  const { dispatch } = useContext(UserContext);
  return dispatch;
};

export default UserContext;
