import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";

import { ME } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const { data } = useQuery(ME, {
    onError: (error) => console.error("Error fetching user data:", error),
  });

  useEffect(() => {
    if (data && data.me) setUser(data.me);
  }, [data]);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        <button onClick={() => setPage("login")}>
          {token ? "logout" : "login"}
        </button>
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
        token={token}
      />
    </div>
  );
};

export default App;
