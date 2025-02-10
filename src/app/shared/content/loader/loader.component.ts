import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-shared-loader',
  template: `
    <div class="loader border-4 border-secondary bg-primary">
      <span class="sub-loader border-2 border-neutral-content"></span>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class SharedLoaderComponent {}
