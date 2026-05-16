import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobPostingServiceService } from 'src/app/services/vessels/job-posting-service.service';
import { VesselRegistrationService } from 'src/app/services/vessels/vessel-registration.service';

@Component({
  selector: 'app-job-suggestions',
  templateUrl: './job-suggestions.component.html',
  styleUrls: ['./job-suggestions.component.scss']
})
export class JobSuggestionsComponent implements OnInit {

  jobSuggestionsForm!: FormGroup;

  jobSuggestions: any[] = [];
  jobList: any[] = [];
  vesselList: any[] = [];
  vesselMap = new Map<number, string>();

  constructor(
    private fb: FormBuilder,
    private jobService: JobPostingServiceService,
    private vesselService: VesselRegistrationService   // ✅ ADD THIS
  ) {}

  ngOnInit(): void {

    // Initialize form
    this.jobSuggestionsForm = this.fb.group({
      selectedJob: ['', Validators.required]
    });

    // Load dropdown data
    this.loadVessels();
  }

  loadVessels(): void {
  this.vesselService.getData().subscribe((data: any[]) => {
    this.vesselList = data;

    // create map: id -> name
    data.forEach(v => {
      this.vesselMap.set(v.id, v.vesselName);
    });

    // After vessels loaded, load jobs
    this.loadJobs();
  });
}

  // Load job postings and map to dropdown
  loadJobs(): void {
  this.jobService.getData().subscribe((data: any[]) => {
    this.jobSuggestions = data.map(job => ({
      label: `${this.vesselMap.get(+job.vesselName)} ~ ${job.position}`, // ✅ FIX
      value: job
    }));
  });
}
  

  // Get selected value 
  getSelectedJob(): void {
    const selected = this.jobSuggestionsForm.value.selectedJob;
    console.log('Selected Job:', selected);

    if (selected) {
      console.log('Vessel:', selected.vesselName);
      console.log('Position:', selected.position);
    }
  }

  // profile cards
   user = {
    surname: 'Charith Mihiran',
    sidNo: 'S0001',
    position: 'AB',
    email: 'charith@example.com',
    phone: '+94 77 123 4567'    
  };
}