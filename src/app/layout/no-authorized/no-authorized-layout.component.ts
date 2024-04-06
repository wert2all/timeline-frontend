import { Component } from '@angular/core';
import { FooterComponent } from '../share/footer/footer.component';

@Component({
  selector: 'app-no-authorized-layout',
  standalone: true,
  templateUrl: './no-authorized-layout.component.html',
  imports: [FooterComponent],
})
export class NoAuthorizedLayoutComponent {}
