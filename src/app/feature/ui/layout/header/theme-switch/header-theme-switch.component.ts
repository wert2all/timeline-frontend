import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorMoonStars,
  phosphorSun,
} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-header-theme-switch',
  standalone: true,
  templateUrl: './header-theme-switch.component.html',
  styleUrls: ['./header-theme-switch.component.scss'],
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ phosphorMoonStars, phosphorSun })],
})
export class HeaderThemeSwitchComponent {
  isDark = input.required<boolean>();
  toggleTheme = output();
}
