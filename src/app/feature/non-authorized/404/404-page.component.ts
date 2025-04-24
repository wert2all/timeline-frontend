import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LayoutComponent } from '../../../shared/layout/layout.component';
import { sharedFeature } from '../../../shared/store/shared/shared.reducers';

@Component({
  standalone: true,
  templateUrl: './404-page.component.html',
  styleUrls: ['./404-page.component.scss'],
  imports: [LayoutComponent],
})
export class PageNotFoundComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly isAuthorized = this.store.selectSignal(
    sharedFeature.isAuthorized
  );

  toMainPage() {
    this.router.navigate(['']);
  }
}
