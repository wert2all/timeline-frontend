import {
  ChangeDetectionStrategy,
  Component,
  ResourceStatus,
  computed,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxInformationOutline } from '@ng-icons/iconsax/outline';
import { map } from 'rxjs';
import { ApiClient } from '../../../api/internal/graphql';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { SharedLoaderComponent } from '../../../shared/content/loader/loader.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { toAccountView } from '../../account/account.functions';
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
    SharedLoaderComponent,
    NgIconComponent,
  ],
  viewProviders: [provideIcons({ saxInformationOutline })],
})
export class TimelinePageComponent {
  timelineId = input<number>(0);

  private readonly api = inject(ApiClient);
  private timelineResource = rxResource({
    request: this.timelineId,
    loader: ({ request }) =>
      this.api
        .getTimeline({ timelineId: request })
        .pipe(
          map(result =>
            apiAssertNotNull(
              extractApiData(result)?.timeline,
              'Cannot load timeline'
            )
          )
        ),
  });

  private readonly successResponse = computed(() =>
    this.timelineResource.status() === ResourceStatus.Resolved
      ? this.timelineResource.value() || null
      : null
  );

  protected readonly loading = computed(() => {
    return this.timelineResource.status() === ResourceStatus.Loading;
  });
  protected readonly error = computed(() => {
    return this.timelineResource.status() === ResourceStatus.Error
      ? this.timelineResource.error() || 'Could not load timeline'
      : null;
  });

  protected readonly timelineAccount = computed((): AccountView | null =>
    toAccountView(this.successResponse()?.account)
  );
}
