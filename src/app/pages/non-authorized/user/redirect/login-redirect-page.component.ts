import { Component, inject } from '@angular/core';
import { GoogleOuthService } from '../../../../api/external/google-outh.service';
import { HeroComponent } from '../../../../share/hero/hero.component';
import { LayoutComponent } from '../../../../share/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-login-redirect-page',
  templateUrl: './login-redirect-page.component.html',
  imports: [LayoutComponent, HeroComponent],
})
export class LoginRedirectPageComponent {
  private readonly googleOuthService = inject(GoogleOuthService);
  isAuthorized = this.googleOuthService.isAuthorized();
}
