import { useQuery } from "@apollo/client";

import { ALL_BOOKS } from "../queries";

const Recommend = ({ show, user }) => {
  const result = useQuery(ALL_BOOKS);
  if (!show) return null;
  if (result.loading) return <div>loading...</div>;

  const books = result.data.allBooks;
  const filteredBooks = books.filter((b) =>
    b.genres.includes(user.favoriteGenre)
  );

  return (
    <>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{user.favoriteGenre}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Recommend;
