import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthTokenStorageService } from '../../store/auth/auth-token-storage.service';

export const handleAuthLink = (
  tokenStorage = inject(AuthTokenStorageService)
): ApolloLink =>
  setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
      ...(tokenStorage.getToken()
        ? { Authorization: `Bearer ${tokenStorage.getToken()}` }
        : {}),
    },
  }));
