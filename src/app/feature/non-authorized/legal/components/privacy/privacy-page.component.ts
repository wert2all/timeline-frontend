import { Component } from '@angular/core';
import { LayoutComponent } from '../../../../../shared/layout/layout.component';
import { TitleComponent } from '../../../../../shared/ui/layout/content/title/title.component';

@Component({
  standalone: true,
  templateUrl: './privacy-page.component.html',
  styleUrls: ['./privacy-page.component.scss'],
  imports: [LayoutComponent, TitleComponent],
})
export class PrivacyPageComponent {}
