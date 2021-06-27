import React, { useState } from "react";
// import PropTypes from "prop-types";
import { gql, useQuery, useMutation } from "@apollo/client";

const booksGql = gql`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
`;

const getBook = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      author
    }
  }
`;

const ADD_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!) {
    createBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $title: String!, $author: String!) {
    updateBook(id: $id, title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
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

  const [updateBook] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      refetch();
    },
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleAddBook = ({ variables }) => {
    addBook({ variables });
  };

  const handleUpdateBook = ({ variables }) => {
    updateBook({ variables });
  };

  const handleDeleteBook = ({ variables }) => {
    deleteBook({ variables });
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="App">
          {data?.books?.map((book) => (
            <Book
              key={book?.id}
              book={book}
              handleUpdateBook={handleUpdateBook}
              handleDeleteBook={handleDeleteBook}
            />
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

const Book = ({
  book = {},
  handleUpdateBook = () => {},
  handleDeleteBook = () => {},
}) => {
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);
  const [isBookEditing, setIsBookEditing] = useState(false);
  const [title, setTitle] = useState(book?.title);
  const [author, setAuthor] = useState(book?.author);
  return (
    <>
      {isBookEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(book);
            handleUpdateBook({ variables: { id: book?.id, title, author } });
            setIsBookEditing(false);
          }}
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
          <button type="submit">
            {isBookEditing ? "Update Book" : "Add Book"}
          </button>
          <button
            onClick={() => {
              setIsBookEditing(false);
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div>
            <span>{book?.title || "-"}</span>
            <span style={{ marginLeft: "8px" }}>{book?.author || "-"}</span>
            <span
              style={{ marginLeft: "16px" }}
              onClick={() => {
                setIsBookEditing(true);
              }}
            >
              Edit
            </span>
            <span
              style={{ marginLeft: "16px" }}
              onClick={() => {
                handleDeleteBook({ variables: { id: book?.id } });
              }}
            >
              Delete
            </span>
            <span
              style={{ marginLeft: "16px" }}
              onClick={() => {
                setIsBookDetailsOpen(true);
              }}
            >
              Details
            </span>
          </div>
          {isBookDetailsOpen && (
            <BookDetails
              id={book?.id}
              setIsBookDetailsOpen={setIsBookDetailsOpen}
            />
          )}
        </>
      )}
    </>
  );
};

const BookDetails = ({ id, setIsBookDetailsOpen }) => {
  const { data, loading } = useQuery(getBook, { variables: { id } });

  if (loading) {
    return "Fetching Book Details...Please wait";
  }

  return (
    <div>
      <p>{`Book Details for ${id}`}</p>
      <span>{`Title : ${data?.book?.title}`}</span>
      <span>{`Author : ${data?.book?.author}`}</span>
      <span
        style={{ marginLeft: "16px" }}
        onClick={() => {
          setIsBookDetailsOpen(false);
        }}
      >
        Close
      </span>
    </div>
  );
};

export default Books;
