import React, { useState } from "react";
// import PropTypes from "prop-types";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Box, Text, Input, Button } from "native-base";

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
    <Box justifyContent="center" width={"100%"} marginTop={"20%"}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Box>
          {data?.books?.map((book) => (
            <Book
              key={book?.id}
              book={book}
              handleUpdateBook={handleUpdateBook}
              handleDeleteBook={handleDeleteBook}
            />
          ))}
        </Box>
      )}
      <Box>
        <Text>Title</Text>
        <Input value={title} onChangeText={(val) => setTitle(val)} />
        <Input value={author} onChangeText={(val) => setAuthor(val)} />
        <Button
          onPress={() => {
            handleAddBook({ variables: { title, author } });
            setTitle("");
            setAuthor("");
          }}
        >
          Add Todo
        </Button>
      </Box>
    </Box>
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
        <Box>
          <Input
            value={title}
            onChangeText={(val) => {
              setTitle(val);
            }}
          />
          <Input value={author} onChangeText={(val) => setAuthor(val)} />
          <Button
            onPress={() => {
              handleUpdateBook({ variables: { id: book?.id, title, author } });
              setIsBookEditing(false);
            }}
          >
            {isBookEditing ? "Update Book" : "Add Book"}
          </Button>
          <Button
            onPress={() => {
              setIsBookEditing(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      ) : (
        <>
          <Box style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Text>{book?.title || "-"}</Text>
            <Text style={{ marginLeft: "8px" }}>{book?.author || "-"}</Text>
            <Text
              style={{ marginLeft: "16px" }}
              onPress={() => {
                setIsBookEditing(true);
              }}
            >
              Edit
            </Text>
            <Text
              style={{ marginLeft: "16px" }}
              onPress={() => {
                handleDeleteBook({ variables: { id: book?.id } });
              }}
            >
              Delete
            </Text>
            <Text
              style={{ marginLeft: "16px" }}
              onPress={() => {
                setIsBookDetailsOpen(true);
              }}
            >
              Details
            </Text>
          </Box>
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
    <Box>
      <Text>{`Book Details for ${id}`}</Text>
      <Text>{`Title : ${data?.book?.title}`}</Text>
      <Text>{`Author : ${data?.book?.author}`}</Text>
      <Text
        style={{ marginLeft: "16px" }}
        onPress={() => {
          setIsBookDetailsOpen(false);
        }}
      >
        Close
      </Text>
    </Box>
  );
};

export default Books;
