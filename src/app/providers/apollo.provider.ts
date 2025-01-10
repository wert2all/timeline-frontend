import { inject, makeEnvironmentProviders } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { APOLLO_NAMED_OPTIONS, Apollo, NamedOptions } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { environment } from '../../environments/environment';
import { handleAuthLink } from './handlers/auth.handler';
import { handleError } from './handlers/error.handler';

const createApolloNamedOptions = (): NamedOptions =>
  Object.fromEntries(
    [
      {
        key: 'default',
        handler: (httpLink = inject(HttpLink)) =>
          httpLink.create({ uri: environment.graphql }),
      },
      {
        key: 'previewly',
        handler: () =>
          createUploadLink({ uri: environment.services.previewly.url }),
      },
    ].map(service => {
      return [
        service.key,
        {
          cache: new InMemoryCache(),
          link: ApolloLink.from([
            handleAuthLink(),
            handleError(),
            service.handler(),
          ]),
        },
      ];
    })
  );

export const provideApollo = () => {
  return makeEnvironmentProviders([
    Apollo,
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: createApolloNamedOptions,
    },
  ]);
};
