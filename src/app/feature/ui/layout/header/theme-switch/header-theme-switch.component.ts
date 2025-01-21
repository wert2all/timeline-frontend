import { Component, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeMoon02, hugeSun03 } from '@ng-icons/huge-icons';
import { saxMoonBold } from '@ng-icons/iconsax/bold';

@Component({
  selector: 'app-header-theme-switch',
  standalone: true,
  templateUrl: './header-theme-switch.component.html',
  styleUrls: ['./header-theme-switch.component.scss'],
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ hugeMoon02, hugeSun03, saxMoonBold })],
})
export class HeaderThemeSwitchComponent {
  isDark = input.required<boolean>();
  toggleTheme = output();
}
