import { Component } from '@angular/core';

import { NotificationsContainerComponent } from '../notifications/notifications-container.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [FooterComponent, HeaderComponent, NotificationsContainerComponent],
})
export class LayoutComponent {}
