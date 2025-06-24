import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieValue } from 'vanilla-cookieconsent';
import { CookieConsentComponent } from '../../feature/ui/layout/components/cookie-consent/cookie-consent.component';
import { NotificationsContainerComponent } from '../../feature/ui/layout/components/notifications/notifications-container.component';
import { FooterComponent } from '../../feature/ui/layout/footer/footer.component';
import { HeaderComponent } from '../../feature/ui/layout/header/header.component';
import { ModalFactoryComponent } from '../../feature/ui/layout/modal-factory/modal-factory.component';
import { NotificationStore } from '../../feature/ui/layout/store/notification/notifications.store';
import { NotificationMessage } from '../../feature/ui/layout/store/notification/notifications.types';
import { TableOfContentsContainerComponent } from '../../feature/ui/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { tableOfYearFeature } from '../../feature/ui/table-of-contents/store/table-of-contents/table-of-contents.reducer';
import { SharedActions } from '../store/shared/shared.actions';

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
    ModalFactoryComponent,
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
    this.store.dispatch(SharedActions.dispatchCookieConsent({ cookie }));
  }

  markRead(message: NotificationMessage) {
    this.notificationStore.markRead(message.uuid);
  }
}
