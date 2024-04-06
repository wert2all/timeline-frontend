import { Component } from '@angular/core';
import { FooterComponent } from '../share/footer/footer.component';
import { HeaderComponent } from '../share/header/header.component';
import { NotificationsContainerComponent } from '../share/notifications/notifications-container.component';

@Component({
  selector: 'app-no-authorized-layout',
  standalone: true,
  templateUrl: './no-authorized-layout.component.html',
  imports: [FooterComponent, HeaderComponent, NotificationsContainerComponent],
})
export class NoAuthorizedLayoutComponent {}
