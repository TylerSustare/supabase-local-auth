import React from "react";
import { Home } from "./Home";
import Auth from "./Auth";
import { UserContextProvider, useUser } from "./UserContext";

import "./App.css";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const authToken = localStorage.getItem("supabase.auth.token");
  const token = authToken ? JSON.parse(authToken) : null;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token
        ? `Bearer ${token?.currentSession?.access_token ?? ""}`
        : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  const Container = () => {
    const { user } = useUser();

    return <>{user ? <Home /> : <Auth />}</>;
  };

  return (
    <UserContextProvider>
      <ApolloProvider client={client}>
        <Container />
      </ApolloProvider>
    </UserContextProvider>
  );
}
