import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Iterable } from '../../../app.types';

@Injectable({ providedIn: 'root' })
export class EventUrlProvider {
  private readonly router = inject(Router);

  provide(event: Iterable): string {
    return this.router.createUrlTree(['/event', event.id]).toString();
  }

  provideAbsolute(event: Iterable): string {
    return (
      window.location.origin +
      this.router.createUrlTree(['/event', event.id]).toString()
    );
  }
}
