import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeMoon02, hugeSun03 } from '@ng-icons/huge-icons';
import { saxMoonBold } from '@ng-icons/iconsax/bold';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss'],
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ hugeMoon02, hugeSun03, saxMoonBold })],
})
export class ThemeSwitchComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly isDark = this.themeService.isDark;
}
