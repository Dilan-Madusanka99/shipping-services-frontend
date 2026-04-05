import { Injectable, signal, computed } from '@angular/core';
import { AppointmentService } from './appointment.service';
// import { CalendarDay } from '../models/appointment.model';
// import { AppointmentService } from './appointment.service';

export interface CalendarMonth {
  year: number;
  month: number; // 0-indexed
  weeks: any[][];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private today = new Date();
  private todayStr = this.formatDate(this.today);

  private _year = signal(this.today.getFullYear());
  private _month = signal(this.today.getMonth());

  readonly year = this._year.asReadonly();
  readonly month = this._month.asReadonly();

  readonly monthLabel = computed(() =>
    `${MONTH_NAMES[this._month()]} ${this._year()}`
  );

  readonly isCurrentMonth = computed(() =>
    this._year() === this.today.getFullYear() && this._month() === this.today.getMonth()
  );

  constructor(private apptService: AppointmentService) {}

  readonly calendarMonth = computed((): CalendarMonth => {
    const year = this._year();
    const month = this._month();
    const appointments = this.apptService.appointments();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay(); // 0=Sun
    const daysInMonth = lastDay.getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: any[] = [];

    // Previous month fill
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrev - i);
      const dateStr = this.formatDate(d);
      cells.push({
        date: d,
        dateStr,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: dateStr === this.todayStr,
        appointments: appointments.filter(a => a.date === dateStr)
          .sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dateStr = this.formatDate(d);
      cells.push({
        date: d,
        dateStr,
        day: i,
        isCurrentMonth: true,
        isToday: dateStr === this.todayStr,
        appointments: appointments.filter(a => a.date === dateStr)
          .sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    // Next month fill (to complete 6 weeks = 42 cells)
    let nextDay = 1;
    while (cells.length < 42) {
      const d = new Date(year, month + 1, nextDay++);
      const dateStr = this.formatDate(d);
      cells.push({
        date: d,
        dateStr,
        day: d.getDate(),
        isCurrentMonth: false,
        isToday: dateStr === this.todayStr,
        appointments: appointments.filter(a => a.date === dateStr)
          .sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    // Split into weeks
    const weeks: any[][] = [];
    for (let i = 0; i < 6; i++) {
      weeks.push(cells.slice(i * 7, i * 7 + 7));
    }

    return { year, month, weeks };
  });

  goToPreviousMonth(): void {
    if (this._month() === 0) {
      this._month.set(11);
      this._year.update(y => y - 1);
    } else {
      this._month.update(m => m - 1);
    }
  }

  goToNextMonth(): void {
    if (this._month() === 11) {
      this._month.set(0);
      this._year.update(y => y + 1);
    } else {
      this._month.update(m => m + 1);
    }
  }

  goToToday(): void {
    this._year.set(this.today.getFullYear());
    this._month.set(this.today.getMonth());
  }

  formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  getTodayStr(): string {
    return this.todayStr;
  }
}
