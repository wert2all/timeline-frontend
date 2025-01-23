import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { SharedAuthTokenProvider } from '../../shared/services/auth-token.provider';

export const handleAuthLink = (
  tokenProvider = inject(SharedAuthTokenProvider)
): ApolloLink =>
  setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
      ...(tokenProvider.token
        ? {
            Authorization: `Bearer ` + tokenProvider.token,
          }
        : {}),
    },
  }));
