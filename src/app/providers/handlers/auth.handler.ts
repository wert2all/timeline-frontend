import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { TokenProvider } from '../../feature/auth/shared/token.provider';

export const handleAuthLink = (
  tokenProvider = inject(TokenProvider)
): ApolloLink =>
  setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
      ...(tokenProvider.getToken()
        ? {
            Authorization: `Bearer ` + tokenProvider.getToken(),
          }
        : {}),
    },
  }));
