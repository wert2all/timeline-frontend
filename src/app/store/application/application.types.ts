import { Loadable } from '../../app.types';

export enum CookieCategory {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
}

export type ApplicationState = Loadable & {
  cookie: CookieCategory[];
};
