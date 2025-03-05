import { Component } from '@angular/core';
import { TitleComponent } from '../../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../../shared/layout/layout.component';

@Component({
  standalone: true,
  selector: 'app-press-kit-page',
  templateUrl: './press-kit-page.component.html',
  imports: [LayoutComponent, TitleComponent],
})
export class PressKitPageComponent {}
