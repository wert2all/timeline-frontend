import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxMenu1Outline } from '@ng-icons/iconsax/outline';
import { TopMenuComponent } from './top-menu/top-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TopMenuComponent],
  templateUrl: './header.component.html',
  viewProviders: [provideIcons({ saxMenu1Outline })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
