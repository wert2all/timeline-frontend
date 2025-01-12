import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxAddOutline,
  saxCalendar1Outline,
  saxCalendarAddOutline,
  saxCalendarTickOutline,
  saxImageOutline,
  saxLinkSquareOutline,
  saxTagOutline,
  saxTextBlockOutline,
} from '@ng-icons/iconsax/outline';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [NgIconComponent],
  viewProviders: [
    provideIcons({
      saxAddOutline,
      saxCalendarAddOutline,
      saxCalendar1Outline,
      saxCalendarTickOutline,
      saxTextBlockOutline,
      saxTagOutline,
      saxLinkSquareOutline,
      saxImageOutline,
    }),
  ],
})
export class EditEventFormTabsComponent {
  activeTab = input(0);
  enebleUpload = input(false);

  switchTab = output<number>();
}
