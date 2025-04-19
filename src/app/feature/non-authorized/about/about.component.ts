import { Component } from '@angular/core';
import { TitleComponent } from '../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

@Component({
  standalone: true,
  templateUrl: './about.component.html',
  imports: [LayoutComponent, TitleComponent],
})
export class AboutPageComponent {}
