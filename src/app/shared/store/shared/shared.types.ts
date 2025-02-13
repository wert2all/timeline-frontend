export enum CookieCategory {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
}

export interface SharedState {
  cookie: CookieCategory[];
}
