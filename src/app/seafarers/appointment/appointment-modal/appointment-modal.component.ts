import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges,
  SimpleChanges, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';

export interface Appointment {
  id: string;
  title: string;
  date: string;       // ISO date string: YYYY-MM-DD
  time: string;       // FHH:mm
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
  type?: string;
  formData?: FormGroup
}

export type AppointmentCategory = 'work' | 'personal' | 'health' | 'social' | 'other';

// validator for appointment dates (shoud be future one)
export function futureDateValidator(control: AbstractControl): ValidationErrors | null {

  if (!control.value) {
    return null;
  }

  const selectedDate = new Date(control.value);
  const today = new Date();

  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selectedDate > today ? null : { pastDate: true };
}

export const APPOINTMENT_COLORS: string[] = [
  '#1a56db', // blue
  '#e53935', // red
  '#2e7d32', // green
  '#f57c00', // orange
  '#7b1fa2', // purple
  '#00838f', // teal
  '#c2185b', // pink
  '#5d4037', // brown
];


export const CATEGORY_LABELS: Record<AppointmentCategory, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  social: 'Social',
  other: 'Other',
};

export interface AppointmentFormData {
  title: string;
  date: string;
  time: string;
  duration: number;
  category: AppointmentCategory;
  color: string;
  notes: string;
  sid?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  mobile?: string;
  email?: string;
  status?: string;
  type?: string;
}

@Component({
  selector: 'app-appointment-modal',
  standalone: false,
  // imports: [CommonModule, FormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './appointment-modal.component.html',
  styleUrls: ['./appointment-modal.component.scss'],
})
export class AppointmentModalComponent implements OnInit, OnChanges {
  @Input() appointment: Appointment | null = null;
  @Input() prefillDate: string = '';
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  appointmentForm : FormGroup;
  sidList: any[] = [];
  readonly colors = APPOINTMENT_COLORS;
  readonly categories = Object.entries(CATEGORY_LABELS) as [AppointmentCategory, string][];

  readonly durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 0, label: 'All day' },
  ];

  readonly positions = [
    { value: 'AB Trainee', label: 'AB Trainee' },
    { value: 'OS', label: 'OS' },
    { value: 'AB', label: 'AB' },
    { value: 'Bosun', label: 'Bosun' },
    { value: 'Pumpman', label: 'Pumpman' },
    { value: 'Oiler', label: 'Oiler' },
    { value: 'Fitter', label: 'Fitter' },
    { value: 'Messman', label: 'Messman' },
    { value: 'Cook', label: 'Cook' },
    { value: 'Electrician', label: 'Electrician' },
  ];

  readonly times = [
    { value: '10.00 - 10.30', label: '10.00 - 10.30'},
    { value: '10.45 - 11.15', label: '10.45 - 11.15'},
    { value: '11.30 - 12.00', label: '11.30 - 12.00'},
    { value: '12.15 - 12.45', label: '12.15 - 12.45'},
    { value: '13.00 - 13.30', label: '13.00 - 13.30'},
  ];

  readonly statuses = [
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'Re-Scheduled', label: 'Re-Scheduled' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Done', label: 'Done' }
  ];

  readonly types = [
    { value: 'Interview', label: 'Interview' },
    { value: 'Inquiry', label: 'Inquiry' }
  ];

  form: AppointmentFormData = this.defaultForm();
  titleError = false;
  dateError = false;
  sidError = false;
  firstNameError = false;
  lastNameError = false;
  positionError = false;
  mobileError = false;
  emailError = false;
  statusError = false;
  timeError = false;
  typeError = false;
  submitted: boolean;

  constructor(
      private fb: FormBuilder,
      private seafarersService: SeafarersServiceService
    ) {
      this.appointmentForm = this.fb.group({
        sidNo: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[A-Za-z0-9]+$/)]),
        firstName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/^[A-Za-z .'-]+$/)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/^[A-Za-z .'-]+$/)]),
        position: new FormControl('', [Validators.required]),
        mobile: new FormControl('', [Validators.required, Validators.pattern(/^07[0-9]{8}$/)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        appointmentDate: new FormControl('', [Validators.required]),
        appointmentTime: new FormControl('', [ Validators.required]),
        appointmentStatus: new FormControl('', [Validators.required]),
        appointmentTypes: new FormControl('', [Validators.required]),
      });
    }

  get isEditing(): boolean {
    return this.appointment !== null;
  }

  ngOnInit(): void {
    this.resetForm();
    this.loadSidNumbers();
    console.log(this.appointment);
  }

  private loadSidNumbers(): void {
    this.seafarersService.getData().subscribe({
      next: (data: any[]) => {
        this.sidList = data;
        console.log('SID List:', this.sidList);
      },
      error: (error) => {
        console.error('Error loading SID numbers:', error);
      }
    });
  }

  onSidChange(selectedSid: string): void {

    const selectedSeafarer = this.sidList.find(
      seafarer => seafarer.sidNo === selectedSid
    );

    if (!selectedSeafarer) {
      return;
    }

    console.log('Selected Seafarer:', selectedSeafarer);

    this.appointmentForm.patchValue({
      position: selectedSeafarer.position,
      firstName: selectedSeafarer.otherNames,
      lastName: selectedSeafarer.surname,
      mobile: selectedSeafarer.mobile,
      email: selectedSeafarer.email
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointment'] || changes['prefillDate']) {
      this.resetForm();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.onClose();
  }

  private defaultForm(): AppointmentFormData {
    return {
      title: '',
      date: this.todayStr(),
      time: '10.00 - 10.30',
      duration: 60,
      category: 'work',
      color: APPOINTMENT_COLORS[0],
      notes: '',
    };
  }

  // private resetForm(): void {
  //   this.titleError = false;
  //   this.dateError = false;
  //   this.sidError = false;
  //   this.firstNameError = false;
  //   this.lastNameError = false;
  //   this.positionError = false;
  //   this.mobileError = false;
  //   this.emailError = false;
  //   this.statusError = false;
  //   this.timeError = false;
  //   this.typeError = false;

  //   if (this.appointment) {
  //     this.form = {
  //       title: this.appointment.title,
  //       date: this.appointment.date,
  //       time: this.appointment.time,
  //       duration: this.appointment.duration,
  //       category: this.appointment.category,
  //       color: this.appointment.color,
  //       notes: this.appointment.notes,
  //     };
  //     this.appointmentForm.patchValue(this.appointment.formData.value);
  //   } else {
  //     this.form = {
  //       ...this.defaultForm(),
  //       date: this.prefillDate || this.todayStr(),
  //     };
  //   }
  // }

private resetForm(): void {
  this.titleError = false;
  this.dateError = false;
  this.sidError = false;
  this.firstNameError = false;
  this.lastNameError = false;
  this.positionError = false;
  this.mobileError = false;
  this.emailError = false;
  this.statusError = false;
  this.timeError = false;
  this.typeError = false;

  if (this.appointment) {
    this.form = {
      title: this.appointment.title,
      date: this.appointment.date,
      time: this.appointment.time,
      duration: this.appointment.duration,
      category: this.appointment.category,
      color: this.appointment.color,
      notes: this.appointment.notes,
    };

    this.appointmentForm.patchValue(this.appointment.formData.value);

  } else {
    const dateToSet = this.prefillDate || this.todayStr();

    this.form = {
      ...this.defaultForm(),
      date: dateToSet,
    };

    // patch into form control
    this.appointmentForm.patchValue({
      appointmentDate: new Date(dateToSet)
    });
  }
}


  selectColor(color: string): void {
    this.form.color = color;
  }


  onSave(): void {
    this.submitted = true;

    // this.dateError = !this.form.date;
    // this.sidError = !this.form.sid?.trim();
    // this.firstNameError = !this.form.firstName?.trim();
    // this.lastNameError = !this.form.lastName?.trim();
    // this.positionError = !this.form.position?.trim();
    // this.mobileError = !this.form.mobile?.trim();
    // this.emailError = !this.form.email?.trim();
    // this.statusError = !this.form.status?.trim();
    // this.timeError = !this.form.time?.trim();
    // if (this.dateError || this.sidError || this.firstNameError
    //   || this.lastNameError || this.positionError || this.mobileError || this.emailError || this.statusError || this.timeError
    // ) return;

    if (this.appointmentForm.invalid) return;
    this.save.emit(this.appointmentForm);
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  private todayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
