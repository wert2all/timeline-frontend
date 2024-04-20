import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenStorageService {
  private readonly tokenKey = 'timeline_auth_token';

  getToken() {
    return localStorage.getItem(this.tokenKey) || null;
  }

  setToken(token: string | null) {
    if (token == null) {
      localStorage.removeItem(this.tokenKey);
    } else {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}
