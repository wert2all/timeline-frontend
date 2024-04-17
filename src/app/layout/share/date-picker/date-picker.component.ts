import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxArrowLeft2Outline,
  saxArrowRight3Outline,
} from '@ng-icons/iconsax/outline';
import { DateTime, Info } from 'luxon';
@Component({
  standalone: true,
  selector: 'app-date-picker',
  imports: [NgIconComponent, FormsModule],
  templateUrl: './date-picker.component.html',
  viewProviders: [
    provideIcons({ saxArrowLeft2Outline, saxArrowRight3Outline }),
  ],
})
export class DatePickerComponent {
  DAYS = Info.weekdays('short');

  fromDate = input<string | null>(null);
  selectDate = output<Date>();

  inputDate = computed(() => {
    const from = this.fromDate();
    const date = from ? DateTime.fromISO(from) : DateTime.now();
    return date.isValid ? date : DateTime.now();
  });

  yearMonth = signal(
    DateTime.fromObject({
      year: this.inputDate().year,
      month: this.inputDate().month,
    })
  );

  selectedYear = computed(() => this.yearMonth().year);
  selectedLongMonth = computed(() => this.yearMonth().monthLong);

  blankDays = computed(() => new Array(this.yearMonth().weekday));
  no_of_days = computed(() => new Array(this.yearMonth().daysInMonth));

  isSelected(day: number) {
    return this.getDateByDay(day).toISODate() === this.inputDate().toISODate();
  }

  selectDay(day: number) {
    this.selectDate.emit(this.getDateByDay(day).toJSDate());
  }

  switchMonth(monthDelta: number) {
    this.yearMonth.update(yearmonth => yearmonth.plus({ month: monthDelta }));
  }

  private getDateByDay(day: number): DateTime {
    return this.yearMonth().set({ day: day });
  }
}
