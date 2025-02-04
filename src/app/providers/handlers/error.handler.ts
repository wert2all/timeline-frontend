import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { Store } from '@ngrx/store';
import { GraphQLFormattedErrorExtensions } from 'graphql/error/GraphQLError';
import { SharedActions } from '../../shared/store/shared/shared.actions';

export const handleError = (store = inject(Store)): ApolloLink => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        if (checkAuthorizationError(extensions)) {
          store.dispatch(SharedActions.logout());
        } else {
          return console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        }
      });
    if (networkError) console.log(`[Network error]:`, networkError);
  });
};

const checkAuthorizationError = (
  extension: GraphQLFormattedErrorExtensions | undefined
) => {
  const code = extension?.['code'] as string;
  return code ? code.startsWith('auth/') : undefined;
};
