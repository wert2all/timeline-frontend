import { Component, inject } from '@angular/core';
import { NotificationsContainerComponent } from '../notifications/notifications-container.component';

import { Store } from '@ngrx/store';
import { TableOfContentsContainerComponent } from '../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContentsComponent } from '../../feature/table-of-contents/components/table-of-contents/table-of-contents.component';
import { tableOfYearFeature } from '../../store/table-of-contents/table-of-contents.reducer';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [
    FooterComponent,
    HeaderComponent,
    NotificationsContainerComponent,
    TableOfContentsComponent,
    TableOfContentsContainerComponent,
  ],
})
export class LayoutComponent {
  private readonly store = inject(Store);

  protected readonly tableOfContents = this.store.selectSignal(
    tableOfYearFeature.selectState
  );
}
