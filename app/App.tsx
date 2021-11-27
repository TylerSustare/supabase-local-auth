import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Auth from "./Auth";
import { UserContextProvider, useUser } from "./UserContext";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { Home } from "./Home";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const authToken = await AsyncStorage.getItem("supabase.auth.token");
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
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <Container />
        </ApolloProvider>
      </SafeAreaProvider>
    </UserContextProvider>
  );
}
