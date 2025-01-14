export enum EnvironmentType {
  production = 'production',
  development = 'development',
}
export interface GoogleServiceEnvironment {
  clientId: string;
}

export interface PreviewlyServiceEnvironment {
  url: string;
  token: string;
}

export interface SentryServiceEnvironment {
  dsn: string;
}

export interface ServiceEnvironments {
  sentry: SentryServiceEnvironment;
  google: GoogleServiceEnvironment;
  previewly: PreviewlyServiceEnvironment;
}

export interface Environment {
  type: EnvironmentType;
  graphql: string;
  services: ServiceEnvironments;
}
