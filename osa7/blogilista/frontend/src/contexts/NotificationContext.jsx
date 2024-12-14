import { createContext, useReducer, useContext } from "react";

// reducer function to handle state changes
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { message: action.payload, error: null };
    case "SET_ERROR":
      return { message: null, error: action.payload };
    case "CLEAR":
      return { message: null, error: null };
    default:
      return state;
  }
};

// create the Notification context
const NotificationContext = createContext();

// context provider component
export const NotificationContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    message: null,
    error: null,
  });

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

// custom hook to access notification state
export const useNotificationValue = () => {
  const { state } = useContext(NotificationContext);
  return state;
};

// custom hook to send messages on successfull user operations
export const useNotifyMessage = () => {
  const { dispatch } = useContext(NotificationContext);
  return (payload) => {
    dispatch({ type: "SET_MESSAGE", payload });
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };
};

// custom hook to send error messages
export const useNotifyError = () => {
  const { dispatch } = useContext(NotificationContext);
  return (payload) => {
    dispatch({ type: "SET_ERROR", payload });
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };
};

export default NotificationContext;
