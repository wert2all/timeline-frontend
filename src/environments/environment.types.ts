export enum EnvironmentType {
  production = 'production',
  development = 'development',
}
export type GoogleServiceEnvironment = {
  clientId: string;
};

export type ThumioServiceEnvironment = {
  apiKey: string;
};

export type PreviewlyServiceEnvironment = {
  token: string;
  url: string;
};

export type ServiceEnvironments = {
  google: GoogleServiceEnvironment;
  thumio: ThumioServiceEnvironment;
  previewly: PreviewlyServiceEnvironment;
};

export interface Environment {
  type: EnvironmentType;
  graphql: string;
  services: ServiceEnvironments;
}
