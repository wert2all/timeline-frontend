import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthService } from '../../services/auth.service';

export const handleAuthLink = (authService = inject(AuthService)): ApolloLink =>
  setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
      ...(authService.idToken
        ? {
            Authorization: `Bearer ` + btoa(authService.idToken),
          }
        : {}),
    },
  }));
