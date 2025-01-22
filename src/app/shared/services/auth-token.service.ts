import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../feature/non-authorized/user/auth.service';

@Injectable({ providedIn: 'root' })
export class SharedAuthTokenService {
  private authService = inject(AuthService);

  public get token(): string | null {
    return this.authService.idToken ? btoa(this.authService.idToken) : null;
  }
}
