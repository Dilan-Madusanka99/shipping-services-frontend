import { Component, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../../services/calendar-service/calendar.service';
import { FormGroup } from '@angular/forms';

export type AppointmentCategory = 'work' | 'personal' | 'health' | 'social' | 'other';

export interface Appointment {
  id: string;
  title: string;
  date: string;       // ISO date string: YYYY-MM-DD
  time: string;       // HH:mm
  duration: number;   // minutes; 0 = all-day
  category: AppointmentCategory;
  color: string;      // hex color
  notes: string;
  createdAt: number;  // timestamp
  sid?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  mobile?: string;
  email?: string;
  status?: string;
  formData?: FormGroup
}

export interface CalendarDay {
  date: Date;
  dateStr: string;    // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Output() dayClick = new EventEmitter<string>();        // dateStr
  @Output() appointmentClick = new EventEmitter<Appointment>();

  readonly weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  readonly monthLabel = this.calSvc.monthLabel;
  readonly calendarMonth = this.calSvc.calendarMonth;
  readonly isCurrentMonth = this.calSvc.isCurrentMonth;

  constructor(private calSvc: CalendarService) {}

  prevMonth(): void { this.calSvc.goToPreviousMonth(); }
  nextMonth(): void { this.calSvc.goToNextMonth(); }
  goToday(): void { this.calSvc.goToToday(); }

  onDayClick(day: CalendarDay): void {
    this.dayClick.emit(day.dateStr);
  }

  onAppointmentClick(appt: Appointment, event: MouseEvent): void {
    event.stopPropagation();
    this.appointmentClick.emit(appt);
  }

  trackByDate(_: number, day: CalendarDay): string {
    return day.dateStr;
  }

  trackByWeek(index: number): number {
    return index;
  }

  trackById(_: number, appt: Appointment): string {
    return appt.id;
  }

  getVisibleAppointments(appts: Appointment[]): Appointment[] {
    return appts.slice(0, 3);
  }

  getOverflowCount(appts: Appointment[]): number {
    return Math.max(0, appts.length - 3);
  }
}
