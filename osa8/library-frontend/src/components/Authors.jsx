import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error(error);
    },
  });

  const result = useQuery(ALL_AUTHORS);

  if (!props.show) return null;
  if (result.loading) return <div>loading...</div>;

  const authors = result.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();
    editBirthyear({ variables: { name, born } });
    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              Author
              <select
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                <option value="" disabled>
                  Select author
                </option>
                {authors.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Born
              <input
                type="number"
                value={born}
                onChange={({ target }) =>
                  setBorn(parseInt(target.value, 10) || "")
                }
              />
            </div>
            <button type="submit" disabled={!name || !born}>
              update author
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
