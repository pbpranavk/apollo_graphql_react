import React, { useState } from "react";
// import PropTypes from "prop-types";
import { gql, useQuery, useMutation } from "@apollo/client";

const booksGql = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`;

const ADD_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!) {
    createBook(title: $title, author: $author) {
      title
      author
    }
  }
`;

const Books = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const { data, loading, refetch } = useQuery(booksGql);

  const [addBook] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleAddBook = ({ variables }) => {
    addBook({ variables });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="App">
          {data?.books?.map((book) => (
            <div>
              <p>{book?.title || "-"}</p>
              <p>{book?.author || "-"}</p>
            </div>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddBook({ variables: { title, author } });
          setTitle("");
          setAuthor("");
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

Books.propTypes = {};

export default Books;
