import { Component, inject } from '@angular/core';
import { NotificationsContainerComponent } from '../../feature/ui/layout/notifications/notifications-container.component';

import { Store } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { TableOfContentsContainerComponent } from '../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { CookieConsentComponent } from '../../feature/ui/layout/cookie-consent/cookie-consent.component';
import { FooterComponent } from '../../feature/ui/layout/footer/footer.component';
import { HeaderComponent } from '../../feature/ui/layout/header/header.component';
import { NotificationStore } from '../../feature/ui/layout/store/notifications.store';
import { NotificationMessage } from '../../feature/ui/layout/store/notifications.types';
import { ApplicationActions } from '../../store/application/application.actions';
import { tableOfYearFeature } from '../../store/table-of-contents/table-of-contents.reducer';

@Component({
  selector: 'app-shared-layout',
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
  private readonly notificationStore = inject(NotificationStore);

  protected readonly tableOfContents = this.store.selectSignal(
    tableOfYearFeature.selectState
  );
  protected readonly unreadMessages = this.notificationStore.unRead;

  cookieConsent(cookie: CookieValue) {
    this.store.dispatch(ApplicationActions.dispatchCookieConsent({ cookie }));
  }

  markRead(message: NotificationMessage) {
    this.notificationStore.markRead(message.uuid);
  }
}
