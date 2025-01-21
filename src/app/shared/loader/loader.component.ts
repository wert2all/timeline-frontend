import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-loader',
  template: `
    <div class="loader border-4 border-secondary bg-primary">
      <span class="sub-loader"></span>
    </div>
  `,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {}
