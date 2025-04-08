import { Component, computed, effect, inject, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorInfo } from '@ng-icons/phosphor-icons/regular';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { SharedEventContentComponent } from '../../../shared/ui/event/content/content.component';
import { ExistEventContent } from '../../../shared/ui/event/content/content.types';
import { toEventView } from '../share/event.functions';
import { ShowEventActions } from '../store/events/actions/show.actions';
import { eventsFeature } from '../store/events/events.reducer';

@Component({
  standalone: true,
  templateUrl: './show-event-page.component.html',
  imports: [LayoutComponent, NgIconComponent, SharedEventContentComponent],
  viewProviders: [provideIcons({ phosphorInfo })],
})
export class ShowEventPageComponent {
  eventId = input<number>(0);

  private readonly store = inject(Store);
  protected isLoading = this.store.selectSignal(eventsFeature.selectLoading);
  protected error = this.store.selectSignal(eventsFeature.selectError);
  private readonly event = this.store.selectSignal(
    eventsFeature.selectShowEvent
  );
  protected readonly eventView = computed((): ExistEventContent | null => {
    const event = this.event();
    return event ? toEventView(event) : null;
  });

  constructor() {
    effect(() => {
      this.store.dispatch(
        ShowEventActions.loadEvent({ eventId: this.eventId() })
      );
    });
  }
}
