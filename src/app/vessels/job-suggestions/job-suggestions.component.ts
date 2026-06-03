import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { CacheService } from 'src/app/services/CacheService';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
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
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private jobService: JobPostingServiceService,
    private vesselService: VesselRegistrationService,   // ✅ ADD THIS
    private cacheService: CacheService,
    private router: Router,
    private _messageService: MessageServiceService
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

  if (!selected) {
    this._messageService.showError('Please select a job');
    return;
  }

  const jobId = selected.id;

  this.jobService.getAuthIds(jobId)
    .then((data: any) => {
      console.log('API Response:', data);

      if (data && data.length > 0) {

        // 🔥 THIS LINE WAS MISSING
        this.users = data.map(u => ({
          surname: u.surname,
          sidNo: u.seafarer_no,
          position: u.position,
          email: u.email,
          mobile: u.mobile
        }));

      } else {
        this.users = [];
        this._messageService.showError('No users found');
      }
    })
    .catch((error) => {
      console.error(error);
      this._messageService.showError('Action Failed');
    });


}
}