import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { AccountView } from '../../account/account.types';
import { SharedAccountViewComponent } from '../../account/share/view/account-view.component';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';

@Component({
  standalone: true,
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutComponent,
    SharedAccountViewComponent,
    SharedTimelineComponent,
  ],
})
export class TimelinePageComponent {
  timelineId = input<number>();

  // private readonly api = inject(ApiClient);
  // private timelineResource = rxResource({
  //   request: this.timelineId,
  //   loader: ({ request }) => {
  //     // return this.api
  //     return of({ request });
  //   },
  // });

  timelineAccount = computed((): AccountView | null => {
    return {
      uuid: 'fake',
      name: 'John Doe',
      firstLetter: 'J',
    };
  });
}
