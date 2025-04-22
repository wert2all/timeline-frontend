import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HeroComponent } from '../../../shared/content/hero/hero.component';
import { TitleComponent } from '../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { NavigationBuilder } from '../../../shared/services/navigation.builder';
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
  private readonly userNavigation = inject(NavigationBuilder).forUser();

  protected readonly isAuthorized = this.store.selectSignal(
    sharedFeature.isAuthorized
  );

  protected loginUrl = computed((): string =>
    this.userNavigation.login().toString()
  );
  protected dashboardUrl = computed(() =>
    this.userNavigation.dashboard().toString()
  );
}
