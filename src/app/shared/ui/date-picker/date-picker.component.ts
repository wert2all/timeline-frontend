import {
  Component,
  computed,
  input,
  output,
  Signal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowLeft,
  phosphorArrowRight,
} from '@ng-icons/phosphor-icons/regular';
import { DateTime, Info } from 'luxon';

@Component({
  standalone: true,
  selector: 'app-shared-date-picker',
  imports: [NgIconComponent, FormsModule],
  templateUrl: './date-picker.component.html',
  viewProviders: [provideIcons({ phosphorArrowRight, phosphorArrowLeft })],
})
export class SharedDatePickerComponent {
  fromDate = input<string | null>(null);
  selectDate = output<Date>();

  private readonly inputDate = computed(() => {
    const from = this.fromDate();
    const date = from ? DateTime.fromISO(from) : DateTime.now();
    return date.isValid ? date : DateTime.now();
  });

  private readonly triggerDateTime = signal<DateTime<true> | null>(null);

  private readonly selectedDate: Signal<DateTime<true>> = computed(() => {
    const triggerDate = this.triggerDateTime();
    return triggerDate ? triggerDate : this.inputDate();
  });

  private readonly firstDayOfMounth = computed(() =>
    this.selectedDate().set({ day: 1 })
  );

  selectedYear = computed(() => this.firstDayOfMounth().year);
  selectedLongMonth = computed(() => this.firstDayOfMounth().monthLong);

  blankDays = computed(() => new Array(this.firstDayOfMounth().weekday - 1));

  days = computed(() =>
    Array.from({ length: this.selectedDate().daysInMonth! }, (_, i) => i + 1)
  );

  showMonth = signal(false);
  showYears = signal(false);

  showDays = computed(() => !this.showMonth() && !this.showYears());

  listDays = signal(Info.weekdays('short'));
  listMonth = signal(Info.months());

  listYears = computed(() =>
    Array.from({ length: 12 }, (_, i) => this.inputDate().year - 6 + i)
  );

  isSelectedMonth(month: number) {
    return this.firstDayOfMounth().month === month;
  }

  isSelectedYear(year: number) {
    return this.firstDayOfMounth().year === year;
  }

  isSelectedDay(day: number) {
    return (
      this.getDateByDay(day).toISODate() === this.selectedDate().toISODate()
    );
  }

  selectDay(day: number) {
    this.triggerDateTime.set(this.getDateByDay(day));
    this.selectDate.emit(this.getDateByDay(day).toJSDate());
  }

  selectMonth(month: number) {
    this.triggerDateTime.update(yearmonth =>
      (yearmonth ? yearmonth : this.inputDate()).set({ month: month })
    );
    this.showMonth.set(false);
  }

  selectYear(year: number) {
    this.triggerDateTime.update(yearmonth =>
      (yearmonth ? yearmonth : this.inputDate()).set({ year: year })
    );
    this.showYears.set(false);
  }

  switchMonth(monthDelta: number) {
    this.triggerDateTime.update(yearmonth =>
      (yearmonth ? yearmonth : this.inputDate()).plus({ month: monthDelta })
    );
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
    return this.selectedDate().set({ day: day });
  }
}
