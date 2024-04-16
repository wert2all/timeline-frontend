import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheckCircleSolid } from '@ng-icons/heroicons/solid';
import { NoAuthorizedLayoutComponent } from '../../../layout/no-authorized/no-authorized-layout.component';

import { saxLinkOutline } from '@ng-icons/iconsax/outline';
import { AddEventComponent } from '../../../components/add-event/add-event.component';
import { DateComponent } from '../../../widgets/timeline/event/date/date.component';
import { TagsComponent } from '../../../widgets/timeline/event/tags/tags.component';
import { UrlComponent } from '../../../widgets/timeline/event/url/url.component';
import { TimelineComponent } from '../../../widgets/timeline/timeline.component';

@Component({
  selector: 'app-index-page',
  standalone: true,
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ heroCheckCircleSolid, saxLinkOutline })],
  imports: [
    CommonModule,
    NoAuthorizedLayoutComponent,
    NgIconComponent,
    TagsComponent,
    DateComponent,
    UrlComponent,
    TimelineComponent,
    AddEventComponent,
  ],
})
export class IndexPageComponent {}
