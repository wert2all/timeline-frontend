import {
  ChangeDetectionStrategy,
  Component,
  ResourceStatus,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxInformationOutline } from '@ng-icons/iconsax/outline';
import { Store, createSelector } from '@ngrx/store';
import { map } from 'rxjs';
import { ApiClient } from '../../../api/internal/graphql';
import { Undefined } from '../../../app.types';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { SharedLoaderComponent } from '../../../shared/content/loader/loader.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { SharedActions } from '../../../shared/store/shared/shared.actions';
import { sharedFeature } from '../../../shared/store/shared/shared.reducers';
import { toAccountView } from '../../account/account.functions';
import { AccountView } from '../../account/account.types';
import { SharedAccountViewComponent } from '../../account/share/view/account-view.component';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';

type AccountSidebar = AccountView & { about: string | Undefined };
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
  private readonly store = inject(Store);

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

  private readonly timelineAccount = computed(
    () => this.successResponse()?.account
  );
  private readonly timelineAccountAvatar = computed(() => {
    const accountAvatarId = this.timelineAccount()?.avatarId;
    return accountAvatarId
      ? this.store.selectSignal(
          createSelector(sharedFeature.selectLoadedImages, images =>
            images.find(image => image.id === accountAvatarId)
          )
        )()?.data?.avatar
      : null;
  });

  protected readonly loading = computed(() => {
    return this.timelineResource.status() === ResourceStatus.Loading;
  });
  protected readonly error = computed(() => {
    return this.timelineResource.status() === ResourceStatus.Error
      ? this.timelineResource.error() || 'Could not load timeline'
      : null;
  });

  protected readonly timelineAccountView = computed(
    (): AccountSidebar | null => {
      const account = this.timelineAccount();
      const avatar = this.timelineAccountAvatar();
      return account
        ? {
            ...toAccountView({ ...account, avatar })!,
            about: account.about,
          }
        : null;
    }
  );

  constructor() {
    effect(() => {
      const account = this.successResponse()?.account;
      if (account?.avatarId) {
        this.store.dispatch(
          SharedActions.dispatchLoadingImages({ ids: [account.avatarId] })
        );
      }
    });
  }
}
