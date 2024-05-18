import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { saxCopyBulk, saxCopySuccessBulk } from '@ng-icons/iconsax/bulk';

@Component({
  selector: 'app-copy-token',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './copy-token.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxCopyBulk, saxCopySuccessBulk })],
})
export class CopyTokenComponent {
  private clipboard: Clipboard = inject(Clipboard);
  token = input<string | null>(null);

  isCopied = signal(false);
  icon = computed(() =>
    this.isCopied() ? 'saxCopySuccessBulk' : 'saxCopyBulk'
  );

  copy() {
    const token = this.token();
    if (token) {
      this.clipboard.copy(token);
      this.isCopied.set(true);
    }
  }
}
