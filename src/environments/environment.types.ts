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
  google: GoogleServiceEnvironment;
  previewly: PreviewlyServiceEnvironment;
};

export interface Environment {
  type: EnvironmentType;
  graphql: string;
  services: ServiceEnvironments;
}
