import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { saxHierarchySquare3Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { HeroComponent } from '../../../shared/content/hero/hero.component';
import { TitleComponent } from '../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { sharedFeature } from '../../../shared/store/shared/shared.reducers';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';

@Component({
  standalone: true,
  templateUrl: './index-page.component.html',
  viewProviders: [provideIcons({ saxHierarchySquare3Outline })],
  imports: [
    LayoutComponent,
    TitleComponent,
    HeroComponent,
    SharedTimelineComponent,
  ],
})
export class IndexPageComponent {
  private readonly store = inject(Store);
  protected readonly isAuthorized = this.store.selectSignal(
    sharedFeature.isAuthorized
  );
}
