import { Component, computed, effect, inject, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorInfo } from '@ng-icons/phosphor-icons/regular';
import { Store, createSelector } from '@ngrx/store';
import { SharedLoaderComponent } from '../../../../shared/content/loader/loader.component';
import { SharedTwoColumnsComponent } from '../../../../shared/content/two-columns/two-columns.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';
import { selectLoadedImage } from '../../../../shared/store/shared/shared.functions';
import { sharedFeature } from '../../../../shared/store/shared/shared.reducers';
import { SharedEventContentComponent } from '../../../../shared/ui/event/content/content.component';
import { EventContentConvertor } from '../../../../shared/ui/event/content/content.convertor';
import { ExistEventContent } from '../../../../shared/ui/event/content/content.types';
import { toAccountView } from '../../../account/account.functions';
import { AccountSidebar } from '../../../account/account.types';
import { SharedAccountViewComponent } from '../../../account/share/view/account-view.component';
import { ShowEventActions } from '../../store/actions/show.actions';
import { eventsFeature } from '../../store/events.reducer';

@Component({
  standalone: true,
  templateUrl: './show-event-page.component.html',
  imports: [
    LayoutComponent,
    NgIconComponent,
    SharedEventContentComponent,
    SharedTwoColumnsComponent,
    SharedLoaderComponent,
    SharedAccountViewComponent,
  ],
  viewProviders: [provideIcons({ phosphorInfo })],
})
export class ShowEventPageComponent {
  eventId = input<number>(0);

  private readonly store = inject(Store);
  private readonly convertor = inject(EventContentConvertor);

  protected isLoading = this.store.selectSignal(eventsFeature.selectLoading);
  protected error = this.store.selectSignal(eventsFeature.selectError);
  private readonly event = this.store.selectSignal(
    eventsFeature.selectShowEvent
  );

  private readonly image = computed(() => {
    const imageId = this.event()?.imageId;
    return imageId ? selectLoadedImage(imageId, this.store) : null;
  });
  protected readonly eventView = computed((): ExistEventContent | null => {
    const event = this.event();
    return event ? this.convertor.fromExistEvent(event, this.image()) : null;
  });

  private timeline = computed(() => {
    const timelineId = this.event()?.timelineId;
    return timelineId
      ? this.store.selectSignal(
          createSelector(
            sharedFeature.selectTimelines,
            timelines => timelines[timelineId]
          )
        )()
      : null;
  });

  private timelineAccount = computed(() => {
    const accountId = this.timeline()?.accountId;
    return accountId
      ? this.store.selectSignal(
          createSelector(
            sharedFeature.selectAccounts,
            accounts => accounts[accountId]
          )
        )()
      : null;
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
        ShowEventActions.loadEvent({ eventId: this.eventId() })
      );
    });
  }
}
