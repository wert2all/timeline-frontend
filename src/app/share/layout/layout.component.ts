import { Component, signal } from '@angular/core';
import { NotificationsContainerComponent } from '../notifications/notifications-container.component';

import { TableOfContentsContainerComponent } from '../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContentsComponent } from '../../feature/table-of-contents/components/table-of-contents/table-of-contents.component';
import { TableOfContents } from '../../feature/table-of-contents/components/table-of-contents/table-of-contents.types';
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
  protected readonly tableOfContent = signal<TableOfContents>({
    items: [],
  });
}
