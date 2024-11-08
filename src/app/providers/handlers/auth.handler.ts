import { inject } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { AuthStorageService } from '../../store/auth/auth-storage.service';

export const handleAuthLink = (
  tokenStorage = inject(AuthStorageService)
): ApolloLink =>
  setContext(() => ({
    headers: {
      Accept: 'charset=utf-8',
      ...(tokenStorage.getToken()
        ? { Authorization: `Bearer ${tokenStorage.getToken()}` }
        : {}),
    },
  }));
