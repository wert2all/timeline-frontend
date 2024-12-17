import { AuthConfig } from 'angular-oauth2-oidc';

export enum EnvironmentType {
  production = 'production',
  development = 'development',
}
export type GoogleServiceEnvironment = {
  clientId: string;
};

export type PreviewlyServiceEnvironment = {
  url: string;
};

export type SentryServiceEnvironment = {
  dsn: string;
};

export type ServiceEnvironments = {
  sentry: SentryServiceEnvironment;
  previewly: PreviewlyServiceEnvironment;
  oAuth: AuthConfig;
};

export interface Environment {
  type: EnvironmentType;
  graphql: string;
  services: ServiceEnvironments;
}
