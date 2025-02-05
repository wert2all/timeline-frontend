import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { HeroComponent } from '../../../shared/content/hero/hero.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { sharedFeature } from '../../../shared/store/shared/shared.reducers';

@Component({
  standalone: true,
  templateUrl: './404-page.component.html',
  styleUrls: ['./404-page.component.scss'],
  imports: [LayoutComponent, HeroComponent],
})
export class PageNotFoundComponent {
  private readonly store = inject(Store);

  protected readonly isAuthorized = this.store.selectSignal(
    sharedFeature.isAuthorized
  );
}
