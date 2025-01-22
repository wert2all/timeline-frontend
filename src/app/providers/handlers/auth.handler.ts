import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { SharedAuthTokenService } from '../../shared/services/auth-token.service';

export const handleAuthLink = (
  authService = inject(SharedAuthTokenService)
): ApolloLink =>
  setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
      ...(authService.token
        ? {
            Authorization: `Bearer ` + authService.token,
          }
        : {}),
    },
  }));
