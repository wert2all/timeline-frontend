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
import { AccountFeaturesSettings } from '../../../features.service';
import { FeatureFlagComponent } from '../../../user/features/feature-flag/feature-flag.component';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [NgIconComponent, FeatureFlagComponent],
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
  accountSettings = input.required<AccountFeaturesSettings>();
  activeTab = input(0);
  switchTab = output<number>();
}
