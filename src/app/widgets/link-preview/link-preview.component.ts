import { Component, computed, inject, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxWarning2Bulk } from '@ng-icons/iconsax/bulk';
import { Store } from '@ngrx/store';
import { Status } from '../../app.types';

import { previewFeature } from '../../store/preview/preview.reducers';

@Component({
  selector: 'app-link-preview',
  standalone: true,
  templateUrl: './link-preview.component.html',
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ saxWarning2Bulk })],
})
export class LinkPreviewComponent {
  link = input.required<URL>();

  private store = inject(Store);
  private readonly allPreviews = this.store.selectSignal(
    previewFeature.selectPreviews
  );

  Status = Status;

  previewHolder = computed(() => {
    return this.allPreviews().find(item => item.url === this.link().toString());
  });
}
