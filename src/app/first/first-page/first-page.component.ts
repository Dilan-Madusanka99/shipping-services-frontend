import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
}

interface Appointment {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  message: string;
}

@Component({
  selector: 'app-first-page',
  standalone: false,
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.scss'
})
export class FirstPageComponent {
  currentSlide = 0;
  showAppointmentModal = false;
  showSuccessModal = false;
  isSubmitting = false;
  minDate = '';

  appointment: Appointment = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  };

  submittedAppointment: Appointment | null = null;

  jobs: Job[] = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      description: 'Join our innovative team building cutting-edge software solutions.'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      description: 'Lead product development and strategy for our flagship platform.'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      salary: '$80,000 - $110,000',
      description: 'Create beautiful and intuitive user experiences for our mobile app.'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Seattle, WA',
      salary: '$110,000 - $140,000',
      description: 'Analyze complex data sets to drive business insights and decisions.'
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'Brand Solutions',
      location: 'Chicago, IL',
      salary: '$70,000 - $90,000',
      description: 'Develop and execute marketing strategies to grow our brand presence.'
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Austin, TX',
      salary: '$95,000 - $125,000',
      description: 'Build and maintain scalable cloud infrastructure and CI/CD pipelines.'
    }
  ];

  constructor(private router: Router) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  nextSlide() {
    if (this.currentSlide < this.jobs.length - 3) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.jobs.length - 3;
    }
  }

  signIn() {
    this.router.navigate(['/auth/signin']);
  }

  signUp() {
    this.router.navigate(['/auth/signup']);
  }

  bookAppointment() {
    this.showAppointmentModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeModal() {
    this.showAppointmentModal = false;
    document.body.style.overflow = 'auto';
    this.resetForm();
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    document.body.style.overflow = 'auto';
  }

  resetForm() {
    this.appointment = {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      service: '',
      message: ''
    };
  }

  async submitAppointment() {
    if (!this.isValidAppointment()) {
      return;
    }

    this.isSubmitting = true;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store the submitted appointment for success modal
      this.submittedAppointment = { ...this.appointment };

      // Close booking modal and show success modal
      this.showAppointmentModal = false;
      this.showSuccessModal = true;

      // Reset form
      this.resetForm();
    } catch (error) {
      alert('There was an error booking your appointment. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  isValidAppointment(): boolean {
    return !!(
      this.appointment.name &&
      this.appointment.email &&
      this.appointment.phone &&
      this.appointment.date &&
      this.appointment.time &&
      this.appointment.service
    );
  }

  getServiceName(serviceValue: string | undefined): string {
    const services: { [key: string]: string } = {
      'career-counseling': 'Career Counseling',
      'resume-review': 'Resume Review',
      'interview-prep': 'Interview Preparation',
      'job-placement': 'Job Placement Assistance',
      'salary-negotiation': 'Salary Negotiation'
    };
    return services[serviceValue || ''] || serviceValue || '';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString: string | undefined): string {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
}
