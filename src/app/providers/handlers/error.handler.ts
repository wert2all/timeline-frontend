import { ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';

export const handleError = (): ApolloLink => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]:`, networkError);
  });
};
