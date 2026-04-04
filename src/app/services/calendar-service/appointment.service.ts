import { Injectable, signal, computed } from '@angular/core';
import { Appointment } from 'src/app/seafarers/appointment/calendar/calendar.component'; 

const STORAGE_KEY = 'ng_appointments';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: generateId(),
    title: 'Team standup',
    date: todayStr(),
    time: '09:00',
    duration: 30,
    category: 'work',
    color: '#1a56db',
    notes: 'Daily sync with the engineering team',
    createdAt: Date.now(),
  },
  {
    id: generateId(),
    title: 'Doctor appointment',
    date: offsetDate(2),
    time: '14:00',
    duration: 60,
    category: 'health',
    color: '#2e7d32',
    notes: 'Annual checkup — bring insurance card',
    createdAt: Date.now(),
  },
  {
    id: generateId(),
    title: 'Lunch with Sarah',
    date: offsetDate(4),
    time: '12:30',
    duration: 90,
    category: 'social',
    color: '#f57c00',
    notes: 'Café Milano on 5th',
    createdAt: Date.now(),
  },
  {
    id: generateId(),
    title: 'Project review',
    date: offsetDate(7),
    time: '10:00',
    duration: 60,
    category: 'work',
    color: '#7b1fa2',
    notes: 'Q1 milestones review with stakeholders',
    createdAt: Date.now(),
  },
];

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private _appointments = signal<Appointment[]>(this.loadFromStorage());

  // Public readonly signal
  readonly appointments = this._appointments.asReadonly();

  // Sorted by date then time
  readonly sortedAppointments = computed(() =>
    [...this._appointments()].sort((a, b) =>
      a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    )
  );

  private loadFromStorage(): Appointment[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Appointment[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse errors
    }
    // Seed with sample data on first run
    this.saveToStorage(SAMPLE_APPOINTMENTS);
    return SAMPLE_APPOINTMENTS;
  }

  private saveToStorage(appts: Appointment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appts));
  }

  getById(id: string): Appointment | undefined {
    return this._appointments().find(a => a.id === id);
  }

  getByDate(dateStr: string): Appointment[] {
    return this._appointments()
      .filter(a => a.date === dateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  add(data: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const appt: Appointment = { ...data, id: generateId(), createdAt: Date.now() };
    const updated = [...this._appointments(), appt];
    this._appointments.set(updated);
    this.saveToStorage(updated);
    return appt;
  }

  update(id: string, data: Partial<Omit<Appointment, 'id' | 'createdAt'>>): void {
    const updated = this._appointments().map(a =>
      a.id === id ? { ...a, ...data } : a
    );
    this._appointments.set(updated);
    this.saveToStorage(updated);
  }

  delete(id: string): void {
    const updated = this._appointments().filter(a => a.id !== id);
    this._appointments.set(updated);
    this.saveToStorage(updated);
  }

  clearAll(): void {
    this._appointments.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }
}
