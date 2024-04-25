import { inject, makeEnvironmentProviders } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../../../environments/environment';
import { AuthTokenStorageService } from '../../store/auth/auth-token-storage.service';

const httpLink = (httpLink = inject(HttpLink)) =>
  httpLink.create({ uri: environment.graphql });
const baseLink = () =>
  setContext(() => ({ headers: { Accept: 'charset=utf-8' } }));

const authLink = (tokenStorage = inject(AuthTokenStorageService)) =>
  setContext(() => {
    const token = tokenStorage.getToken();
    return token === null
      ? {}
      : {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  });

export const provideApollo = () =>
  makeEnvironmentProviders([
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: () => ({
        link: ApolloLink.from([baseLink(), authLink(), httpLink()]),
        cache: new InMemoryCache(),
      }),
    },
  ]);
