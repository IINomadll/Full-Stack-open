import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useApolloClient } from "@apollo/client";

import { LOGIN } from "../queries";

const Login = ({ show, setToken, setPage, token }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const client = useApolloClient();

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.error(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      console.log("RESULT:", result.data);
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setUsername("");
      setPassword("");
      setPage("authors");
    }
  }, [result.data]);

  const submit = async (event) => {
    event.preventDefault();

    login({ variables: { username, password } });
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (!show) return null;
  if (token) {
    return (
      <div>
        <p>user is logged in</p>
        <button onClick={logout}>logout</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
