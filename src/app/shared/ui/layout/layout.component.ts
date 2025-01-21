import { Component, inject } from '@angular/core';
import { NotificationsContainerComponent } from '../../notifications/notifications-container.component';

import { Store } from '@ngrx/store';
import { TableOfContentsContainerComponent } from '../../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { tableOfYearFeature } from '../../../store/table-of-contents/table-of-contents.reducer';
import { CookieConsentComponent } from '../../cookie-consent/cookie-consent.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from './footer/footer.component';

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
}
