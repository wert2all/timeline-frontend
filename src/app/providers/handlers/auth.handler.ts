import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthFacade } from '../../feature/auth/auth.facade';

export const handleAuthLink = (
  tokenProvider = inject(AuthFacade)
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
