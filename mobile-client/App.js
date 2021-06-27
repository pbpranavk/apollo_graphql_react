import { StatusBar } from "expo-status-bar";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NativeBaseProvider } from "native-base";

import Books from "./Books";

// import { StyleSheet, Text, View } from 'react-native';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <NativeBaseProvider>
      <ApolloProvider client={client}>
        <Books />
      </ApolloProvider>
    </NativeBaseProvider>
  );
}
