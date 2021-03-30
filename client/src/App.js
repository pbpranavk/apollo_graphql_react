// import logo from './logo.svg';
import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import Books from "./Books";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Books />
    </ApolloProvider>
  );
}

export default App;
