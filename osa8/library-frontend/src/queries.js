import { gql } from "@apollo/client";

// type Book {
//   title: String!
//   published: Int!
//   author: Author!
//   genres: [String!]!
//   id: ID!
// }

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query allBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      title
      author {
        name
        born
      }
      published
      genres
    }
  }
`;

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      id
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const EDIT_BIRTHYEAR = gql`
  mutation editBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
