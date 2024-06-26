export enum EnvironmentType {
  production = 'production',
  development = 'development',
}

export interface Environment {
  type: EnvironmentType;
  googleClientId: string;
  graphql: string;
  thumApiKey: string;
}
