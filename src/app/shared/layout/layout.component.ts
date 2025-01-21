import { Component, inject } from '@angular/core';
import { NotificationsContainerComponent } from '../notifications/notifications-container.component';

import { Store } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { TableOfContentsContainerComponent } from '../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { CookieConsentComponent } from '../../feature/ui/layout/cookie-consent/cookie-consent.component';
import { FooterComponent } from '../../feature/ui/layout/footer/footer.component';
import { ApplicationActions } from '../../store/application/application.actions';
import { tableOfYearFeature } from '../../store/table-of-contents/table-of-contents.reducer';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [
    FooterComponent,
    HeaderComponent,
    NotificationsContainerComponent,
    TableOfContentsContainerComponent,
    CookieConsentComponent,
  ],
})
export class LayoutComponent {
  private readonly store = inject(Store);

  protected readonly tableOfContents = this.store.selectSignal(
    tableOfYearFeature.selectState
  );

  cookieConsent(cookie: CookieValue) {
    this.store.dispatch(ApplicationActions.dispatchCookieConsent({ cookie }));
  }
}
