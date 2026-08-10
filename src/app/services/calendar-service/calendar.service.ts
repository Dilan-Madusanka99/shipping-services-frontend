import { Injectable, signal, computed } from '@angular/core';
import { AppointmentService } from '../seafarers/appointment.service';

export interface CalendarMonth {
  year: number;
  month: number; // 0 = January
  weeks: any[][];
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  // today
  private today = new Date();
  private todayStr = this.formatDate(this.today);

  // current year, month
  private _year = signal(
    this.today.getFullYear()
  );

  private _month = signal(
    this.today.getMonth()
  );

  readonly year =
    this._year.asReadonly();

  readonly month =
    this._month.asReadonly();

    // real backend appointment
  private _appointments =
    signal<any[]>([]);

  readonly appointments =
    this._appointments.asReadonly();

    // month label
  readonly monthLabel = computed(() =>
    `${MONTH_NAMES[this._month()]} ${this._year()}`
  );

  // current month check
  readonly isCurrentMonth = computed(() =>
    this._year() === this.today.getFullYear() &&
    this._month() === this.today.getMonth()
  );

  constructor(
    private appointmentService: AppointmentService
  ) {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getData().subscribe({
      next: (data: any[]) => {
        console.log(
          'REAL APPOINTMENTS FROM BACKEND:',
          data
        );

        if (!Array.isArray(data)) {
          this._appointments.set([]);
          return;
        }

        const appointments = data

          // Do not show cancelled appointments
          .filter((item: any) => {
            const status =
              String(
                item.appointmentStatus ?? ''
              ).toLowerCase();

            return status !== 'cancelled';
          })

          // Convert backend data to calendar data
          .map((item: any) => {
            const appointment = {
              id: String(item.id),
              title:
                `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim(),

              date:
                this.normalizeDate(
                  item.appointmentDate
                ),

              time:
                this.normalizeTime(
                  item.appointmentTime
                ),

              duration: 0,
              category: 'personal',
              color: '#2563eb',
              notes: '',
              createdAt: Date.now(),
              sid: item.sidNo,
              firstName: item.firstName,
              lastName: item.lastName,
              position: item.position,
              mobile: item.mobile,
              email: item.email,
              status: item.appointmentStatus,
              type: item.appointmentTypes
            };

            return appointment;
          });

        console.log(
          'CALENDAR APPOINTMENTS:',
          appointments
        );

        this._appointments.set(
          appointments
        );
      },

      error: (error) => {
        console.error(
          'ERROR LOADING CALENDAR APPOINTMENTS:',
          error
        );
        this._appointments.set([]);
      }
    });
  }

  // calender month
  readonly calendarMonth =
    computed((): CalendarMonth => {

      const year =
        this._year();

      const month =
        this._month();

      const appointments =
        this._appointments();

      // First day of month
      const firstDay =
        new Date(
          year,
          month,
          1
        );

      // Last day of month
      const lastDay =
        new Date(
          year,
          month + 1,
          0
        );

      // Sunday = 0
      const startOffset =
        firstDay.getDay();

      // Number of days in current month
      const daysInMonth =
        lastDay.getDate();

      // Number of days in previous month
      const daysInPrev =
        new Date(
          year,
          month,
          0
        ).getDate();

      const cells: any[] = [];

// previous month
      for (
        let i = startOffset - 1;
        i >= 0;
        i--
      ) {

        const d =
          new Date(
            year,
            month - 1,
            daysInPrev - i
          );

        const dateStr =
          this.formatDate(d);

        cells.push({
          date: d,
          dateStr,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday:
            dateStr === this.todayStr,

          appointments:
            this.getAppointmentsForDate(
              appointments,
              dateStr
            )
        });
      }

      // current month
      for (
        let i = 1;
        i <= daysInMonth;
        i++
      ) {

        const d =
          new Date(
            year,
            month,
            i
          );
        const dateStr =
          this.formatDate(d);

        cells.push({
          date: d,
          dateStr,
          day: i,
          isCurrentMonth: true,
          isToday:
            dateStr === this.todayStr,

          appointments:
            this.getAppointmentsForDate(
              appointments,
              dateStr
            )
        });
      }

      // next month complete 42 cells
      let nextDay = 1;

      while (
        cells.length < 42
      ) {
        const d =
          new Date(
            year,
            month + 1,
            nextDay++
          );

        const dateStr =
          this.formatDate(d);

        cells.push({
          date: d,
          dateStr,
          day: d.getDate(),
          isCurrentMonth: false,
          isToday:
            dateStr === this.todayStr,

          appointments:
            this.getAppointmentsForDate(
              appointments,
              dateStr
            )
        });
      }

      // split into 6 weeks
      const weeks: any[][] = [];

      for (
        let i = 0;
        i < 6;
        i++
      ) {

        weeks.push(
          cells.slice(
            i * 7,
            i * 7 + 7
          )
        );
      }

      return {
        year,
        month,
        weeks
      };
    });

    // get appointment for specific date
  private getAppointmentsForDate(
    appointments: any[],
    dateStr: string
  ): any[] {

    return appointments
      .filter(
        appointment =>
          appointment.date === dateStr
      )
      .sort(
        (a, b) =>
          String(a.time ?? '')
            .localeCompare(
              String(b.time ?? '')
            )
      );
  }

  // data normalization
  private normalizeDate(
    value: any
  ): string {

    if (!value) {
      return '';
    }

    // already yyyy mm dd
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

      return value;
    }

    // --------------------------------------------
    // ISO date
    // Example:
    // 2026-08-10T00:00:00
    // --------------------------------------------

    if (
      typeof value === 'string'
    ) {
      const date =
        new Date(value);
      if (
        !isNaN(
          date.getTime()
        )
      ) {
        return this.formatDate(
          date
        );
      }
    }

    // --------------------------------------------
    // Java LocalDate
    // Example:
    // [2026, 8, 10]
    // --------------------------------------------
    if (
      Array.isArray(value) &&
      value.length >= 3
    ) {

      const year =
        Number(value[0]);

      const month =
        Number(value[1]);

      const day =
        Number(value[2]);


      return `${year}-${String(
        month
      ).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
    }
    return '';
  }

  // time normalization
  private normalizeTime(
    value: any
  ): string {

    if (!value) {
      return '';
    }

    const text =
      String(value).trim();

    // --------------------------------------------
    // 10:00:00 → 10:00
    // --------------------------------------------
    if (
      /^\d{2}:\d{2}:\d{2}$/.test(text)
    ) {

      return text.substring(
        0,
        5
      );
    }

    // --------------------------------------------
    // Already HH:mm
    // --------------------------------------------

    if (
      /^\d{2}:\d{2}$/.test(text)
    ) {
      return text;
    }
    return text;
  }

  // previous month
  goToPreviousMonth(): void {
    if (
      this._month() === 0
    ) {
      this._month.set(11);
      this._year.update(
        y => y - 1
      );
    } else {
      this._month.update(
        m => m - 1
      );
    }
  }

  // next month
  goToNextMonth(): void {
    if (
      this._month() === 11
    ) {
      this._month.set(0);
      this._year.update(
        y => y + 1
      );
    } else {
      this._month.update(
        m => m + 1
      );
    }
  }

  // go to day
  goToToday(): void {
    this._year.set(
      this.today.getFullYear()
    );
    this._month.set(
      this.today.getMonth()
    );
    // Refresh real bookings
    this.loadAppointments();
  }

  // format date
  formatDate(
    d: Date
  ): string {

    const y =
      d.getFullYear();

    const m =
      String(
        d.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        d.getDate()
      ).padStart(2, '0');

    return `${y}-${m}-${day}`;
  }

  // today string
  getTodayStr(): string {
    return this.todayStr;
  }

  // refresh real bookings
  refreshAppointments(): void {
    this.loadAppointments();
  }
}