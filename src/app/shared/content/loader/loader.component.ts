import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-shared-loader',
  template: `
    <div class="loader border-secondary bg-primary border-4">
      <span class="sub-loader border-neutral-content border-2"></span>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class SharedLoaderComponent {}
