import { Component } from '@angular/core';
import { NotificationsContainerComponent } from '../../share/notifications/notifications-container.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-no-authorized-layout',
  standalone: true,
  templateUrl: './no-authorized-layout.component.html',
  imports: [FooterComponent, HeaderComponent, NotificationsContainerComponent],
})
export class NoAuthorizedLayoutComponent {}
