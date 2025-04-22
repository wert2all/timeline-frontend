import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { phosphorInfo } from '@ng-icons/phosphor-icons/regular';
import { Store, createSelector } from '@ngrx/store';
import { Undefined } from '../../../../app.types';
import { SharedLoaderComponent } from '../../../../shared/content/loader/loader.component';
import { SharedTwoColumnsComponent } from '../../../../shared/content/two-columns/two-columns.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { SharedActions } from '../../../../shared/store/shared/shared.actions';
import { selectLoadedImage } from '../../../../shared/store/shared/shared.functions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { toAccountView } from '../../../account/account.functions';
import { AccountSidebar, ShortAccount } from '../../../account/account.types';
import { SharedAccountViewComponent } from '../../../account/share/view/account-view.component';
import { SharedTimelineComponent } from '../../share/timeline/timeline.component';
import { LoadTimelinesActions } from '../../store/actions/load-timelines.actions';
import { timelineFeature } from '../../store/timeline.reducers';
import { Timeline } from '../../store/timeline.types';

@Component({
  standalone: true,
  selector: 'app-show-timeline-page',
  templateUrl: './show-timeline-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LayoutComponent,
    SharedAccountViewComponent,
    SharedTimelineComponent,
    SharedLoaderComponent,
    SharedTwoColumnsComponent,
  ],
  viewProviders: [provideIcons({ phosphorInfo })],
})
export class ShowTimelinePageComponent {
  timelineId = input<number>(0);

  private readonly store = inject(Store);

  protected readonly loading = this.store.selectSignal(
    sharedFeature.selectLoadingAccounts
  );

  protected isAuthorized = this.store.selectSignal(sharedFeature.isAuthorized);

  private timeline = computed((): Timeline | Undefined => {
    const timelineId = this.timelineId();
    return this.store.selectSignal(
      createSelector(
        timelineFeature.selectTimelines,
        timelines => timelines[timelineId]
      )
    )();
  });

  private timelineAccount = computed((): ShortAccount | Undefined => {
    const accountId = this.timeline()?.accountId;
    return accountId
      ? this.store.selectSignal(
          createSelector(
            sharedFeature.selectAccounts,
            accounts => accounts[accountId]
          )
        )()
      : undefined;
  });

  private readonly timelineAccountAvatar = computed(() => {
    const accountAvatarId = this.timelineAccount()?.avatar.id;
    return accountAvatarId
      ? selectLoadedImage(accountAvatarId, this.store)?.data?.avatar
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
      this.store.dispatch(
        LoadTimelinesActions.loadTimeline({ timelineId: this.timelineId() })
      );
    });
    effect(() => {
      const avatarId = this.timelineAccount()?.avatar.id;
      if (avatarId) {
        this.store.dispatch(
          SharedActions.dispatchLoadingImages({ ids: [avatarId] })
        );
      }
    });
  }
}
