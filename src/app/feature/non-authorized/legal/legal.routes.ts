import { Routes } from '@angular/router';
import { CookiePageComponent } from './components/cookie/cookie-page.component';
import { PrivacyPageComponent } from './components/privacy/privacy-page.component';
import { TermsPageComponent } from './components/terms/terms-page.component';

export const routes: Routes = [
  { path: 'privacy', component: PrivacyPageComponent },
  { path: 'terms', component: TermsPageComponent },
  { path: 'cookie-policy', component: CookiePageComponent },
];
