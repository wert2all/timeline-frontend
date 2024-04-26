import { Loadable, User } from '../../app.types';

export type AuthorizedUser = {
  uuid: number;
  name: string;
  avatar: string;
};

export type AuthState = Loadable & {
  token: string | null;
  authorizedUser: AuthorizedUser | null;
  potentialUser: User | null;
};

export type IdConfiguration = google.accounts.id.IdConfiguration;
export type CredentialResponse = google.accounts.id.CredentialResponse;
export type GoogleUserInfo = {
  at_hash: string;
  aud: string;
  azp: string;

  email: string;

  email_verified: boolean;
  exp: number;
  family_name: string;

  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  locale: string;
  name: string;
  nbf: number;
  nonce: string;
  picture: string;
  sub: string;
};

declare global {
  interface Window {
    onGoogleLibraryLoad?: () => void;
  }
}
