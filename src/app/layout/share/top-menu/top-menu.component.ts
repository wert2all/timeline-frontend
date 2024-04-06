import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthControlButtonComponent } from '../auth-control-button/auth-control-button.component';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [CommonModule, AuthControlButtonComponent],
  templateUrl: './top-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent {}
