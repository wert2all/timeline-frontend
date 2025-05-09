import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HeroComponent } from '../../../shared/content/hero/hero.component';
import { TitleComponent } from '../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { NavigationBuilder } from '../../../shared/services/navigation/navigation.builder';
import { sharedFeature } from '../../../shared/store/shared/shared.reducers';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';

@Component({
  standalone: true,
  templateUrl: './index-page.component.html',
  imports: [
    LayoutComponent,
    TitleComponent,
    HeroComponent,
    SharedTimelineComponent,
  ],
})
export class IndexPageComponent {
  private readonly store = inject(Store);
  private readonly navigationBuilder = inject(NavigationBuilder);

  protected readonly isAuthorized = this.store.selectSignal(
    sharedFeature.isAuthorized
  );

  protected loginUrl = computed((): string =>
    this.navigationBuilder.forUser().login().getFullUrlString()
  );
  protected dashboardUrl = computed(() =>
    this.navigationBuilder.forDashboard().index().getFullUrlString()
  );
  protected timelineUrl = computed(() => {
    return this.navigationBuilder.forTimeline(1).show().getFullUrlString();
  });
}
