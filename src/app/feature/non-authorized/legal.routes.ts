import { Routes } from '@angular/router';
import { CookiePageComponent } from '../static-content/share/cookie/cookie-page.component';
import { PrivacyPageComponent } from '../static-content/share/privacy/privacy-page.component';
import { TermsPageComponent } from '../static-content/share/terms/terms-page.component';

export const routes: Routes = [
  { path: 'privacy', component: PrivacyPageComponent },
  { path: 'terms', component: TermsPageComponent },
  { path: 'cookie-policy', component: CookiePageComponent },
];
