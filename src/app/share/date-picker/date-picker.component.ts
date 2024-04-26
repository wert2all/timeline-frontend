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
  days = computed(() =>
    Array.from({ length: this.yearMonth().daysInMonth! }, (_, i) => i + 1)
  );

  showMonth = signal(false);
  showYears = signal(false);

  showDays = computed(() => !this.showMonth() && !this.showYears());

  listDays = signal(Info.weekdays('short'));
  listMonth = signal(Info.months());
  listYears = computed(() =>
    Array.from({ length: 12 }, (_, i) => this.yearMonth().year - 6 + i)
  );

  isSelectedMonth(month: number) {
    return this.yearMonth().month === month;
  }

  isSelectedYear(year: number) {
    return this.yearMonth().year === year;
  }

  isSelectedDay(day: number) {
    return this.getDateByDay(day).toISODate() === this.inputDate().toISODate();
  }

  selectDay(day: number) {
    this.selectDate.emit(this.getDateByDay(day).toJSDate());
  }

  selectMonth(month: number) {
    this.yearMonth.update(yearmonth => yearmonth.set({ month: month }));
    this.showMonth.set(false);
  }

  selectYear(year: number) {
    this.yearMonth.update(yearmonth => yearmonth.set({ year: year }));
    this.showYears.set(false);
  }

  switchMonth(monthDelta: number) {
    this.yearMonth.update(yearmonth => yearmonth.plus({ month: monthDelta }));
  }

  toggleYearsSelector() {
    this.showYears.update(show => !show);
    this.showMonth.set(false);
  }

  toggleMonthSelector() {
    this.showMonth.update(show => !show);
    this.showYears.set(false);
  }

  private getDateByDay(day: number): DateTime {
    return this.yearMonth().set({ day: day });
  }
}
