import { Component, Output, EventEmitter} from '@angular/core';
import { CalendarService } from '../../../services/calendar-service/calendar.service';
import { AppointmentService } from 'src/app/services/seafarers/appointment.service';
import { FormGroup } from '@angular/forms';

export type AppointmentCategory =
  'work'
  | 'personal'
  | 'health'
  | 'social'
  | 'other';

export interface Appointment {

  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  category: AppointmentCategory;
  color: string;
  notes: string;
  createdAt: number;
  sid?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  mobile?: string;
  email?: string;
  status?: string;
  type?: string;
  formData?: FormGroup;
}


export interface CalendarDay {
  date: Date;
  dateStr: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}


@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {

  @Output()
  dayClick =
    new EventEmitter<string>();

  @Output()
  appointmentClick =
    new EventEmitter<Appointment>();

  @Output()
  openAddModalFromJobSuggestions =
    new EventEmitter();

  readonly weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

// calender data
  readonly monthLabel =
    this.calSvc.monthLabel;

  readonly calendarMonth =
    this.calSvc.calendarMonth;

  readonly isCurrentMonth =
    this.calSvc.isCurrentMonth;

  MAX_BOOKINGS = 5;

  constructor(
    private calSvc: CalendarService,
    private appointmentService: AppointmentService
  ) {}


// month navigatioin
  prevMonth(): void {
    this.calSvc.goToPreviousMonth();
  }

  nextMonth(): void {
    this.calSvc.goToNextMonth();
  }

  goToday(): void {
    this.calSvc.goToToday();
  }



// refresh calender
  refreshCalendar(): void {
    this.calSvc.refreshAppointments();
  }

// check past date
  isPastDate(
    date: Date
  ): boolean {

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const d =
      new Date(date);

    d.setHours(
      0,
      0,
      0,
      0
    );

    return d < today;
  }

// check data more than one month
  isAfterOneMonth(
    date: Date
  ): boolean {

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const maxDate =
      new Date(today);

    maxDate.setMonth(
      maxDate.getMonth() + 1
    );

    if (
      maxDate.getDate() !==
      today.getDate()
    ) {

      maxDate.setDate(0);
    }

    const d =
      new Date(date);

    d.setHours(
      0,
      0,
      0,
      0
    );

    return d > maxDate;
  }

  // check weekend
  isWeekend(
    date: Date
  ): boolean {

    const day =
      date.getDay();

    return (
      day === 0 ||
      day === 6
    );
  }

// checked fully booked
  isFullyBooked(
    day: CalendarDay
  ): boolean {

    return (
      day.appointments.length >=
      this.MAX_BOOKINGS
    );
  }

// disabled dates
  isDisabled(
    day: CalendarDay
  ): boolean {
    return (
      this.isPastDate(
        day.date
      )

      ||

      this.isAfterOneMonth(
        day.date
      )

      ||

      this.isWeekend(
        day.date
      )

      ||

      this.isFullyBooked(
        day
      )
    );
  }

  // day click
  onDayClick(
    day: CalendarDay
  ): void {
    if (
      this.isDisabled(day)
    ) {
      alert(
        'This date is not available'
      );
      return;
    }

    this.dayClick.emit(
      day.dateStr
    );
  }

 // appointment click
  onAppointmentClick(
    appt: Appointment,
    event: MouseEvent
  ): void {
    event.stopPropagation();
    this.appointmentClick.emit(
      appt
    );
  }

 // track date
  trackByDate(
    _: number,
    day: CalendarDay
  ): string {
    return day.dateStr;
  }

 // track week
  trackByWeek(
    index: number
  ): number {
    return index;
  }

 // track appointment
  trackById(
    _: number,
    appt: Appointment
  ): string {

    return appt.id;
  }

  // visible appointments
  getVisibleAppointments(
    appts: Appointment[]
  ): Appointment[] {
    return appts.slice(0, 2);
  }

  // overflow count
  getOverflowCount(
    appts: Appointment[]
  ): number {
    return Math.max(
      0,
      appts.length - 2
    );
  }

  // format time
  formatTime(
    time: string
  ): string {
    if (!time) {
      return '';
    }

    const parts =
      time.split(':');

    const hours =
      Number(parts[0]);

    const minutes =
      Number(parts[1]);

    if (
      isNaN(hours) ||
      isNaN(minutes)
    ) {

      return time;
    }

    const date =
      new Date();

    date.setHours(
      hours,
      minutes,
      0,
      0
    );
    return date.toLocaleTimeString(
      'en-US',
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    );
  }

  getAppointmentTooltip(appt: Appointment): string {
    const fullName = [
      appt.firstName,
      appt.lastName
    ]
      .filter(name => !!name)
      .join(' ');

    return [
      fullName || 'Unknown Name',
      `SID: ${appt.sid || 'N/A'}`,
      `Position: ${appt.position || 'N/A'}`,
      `Time: ${this.formatTime(appt.time)}`
    ].join('\n');
  }

// booked sid 
  getBookedSids(
    day: CalendarDay
  ): string {
    if (
      !day.appointments ||
      day.appointments.length === 0
    ) {

      return 'No appointments booked';
    }

    const sids =
      day.appointments
        .map(
          appt => appt.sid
        )
        .filter(
          (
            sid
          ): sid is string =>
            !!sid
        );

    if (
      sids.length === 0
    ) {

      return 'No SID information';
    }

    return (
      'Booked SID:\n' +
      sids.join('\n')
    );
  }
}