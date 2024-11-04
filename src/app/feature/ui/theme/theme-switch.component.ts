import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss'],
})
export class ThemeSwitchComponent {
  protected readonly themeService = inject(ThemeService);

  protected readonly isDark = this.themeService.isDark();
}
