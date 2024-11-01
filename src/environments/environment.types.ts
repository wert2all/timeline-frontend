export enum EnvironmentType {
  production = 'production',
  development = 'development',
}
export type GoogleServiceEnvironment = {
  clientId: string;
};

export type PreviewlyServiceEnvironment = {
  token: string;
  url: string;
};

export type ServiceEnvironments = {
  google: GoogleServiceEnvironment;
  previewly: PreviewlyServiceEnvironment;
};

export interface Environment {
  type: EnvironmentType;
  graphql: string;
  services: ServiceEnvironments;
}
