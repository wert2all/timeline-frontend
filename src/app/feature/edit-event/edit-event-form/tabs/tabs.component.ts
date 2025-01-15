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
import { Unique } from '../../../../app.types';
import { Tabs } from '../edit-event-form.types';

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
  tabs = input.required<Tabs[]>();
  activeTab = input<Unique | null>(null);

  switchTab = output<Unique>();
}
