import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { AccountView } from '../../account/account.types';
import { SharedAccountViewComponent } from '../../account/share/view/account-view.component';

@Component({
  standalone: true,
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent, SharedAccountViewComponent],
})
export class TimelinePageComponent {
  timelineAccount = computed((): AccountView | null => null);
}
