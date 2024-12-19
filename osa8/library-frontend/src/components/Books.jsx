import { useState } from "react";
import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [currentGenre, setCurrentGenre] = useState("all");
  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: currentGenre === "all" ? null : currentGenre,
    },
  });

  if (!props.show) return null;
  if (result.loading) return <div>loading...</div>;

  const books = result.data.allBooks;

  // flatMap ensures that genres remains as a one dimentional array
  // Set removes any duplicate values
  // "all" added manually at the end
  const genres = [...new Set(books.flatMap((b) => b.genres)), "all"];

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{currentGenre}</strong>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setCurrentGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
