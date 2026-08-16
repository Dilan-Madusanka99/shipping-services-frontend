import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { CacheService } from 'src/app/services/CacheService';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { JobPostingServiceService } from 'src/app/services/vessels/job-posting-service.service';
import { VesselRegistrationService } from 'src/app/services/vessels/vessel-registration.service';
import { MatDialog } from '@angular/material/dialog';
import { SeafarerProfileComponent } from 'src/app/seafarers/seafarer-profile/seafarer-profile.component';

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
    private vesselService: VesselRegistrationService,
    private cacheService: CacheService,
    private router: Router,
    private _messageService: MessageServiceService,
    private dialog: MatDialog
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
    let openJobs: any[] = data.filter(job => {
      const jobStatus: string = job.jobStatus;
      return jobStatus.toLowerCase() === 'open';
    });
    this.jobSuggestions = openJobs.map(job => ({
      label: `${this.vesselMap.get(+job.vesselName)} ~ ${job.position}`, // FIX
      value: job
    }));
  });
}
  
  // Get selected value 
getSelectedJob(): void {
  const selected = this.jobSuggestionsForm.value.selectedJob;

  if (!selected) {
    this._messageService.showWarn('Please select a job');
    return;
  }

  const jobId = selected.id;

  this.jobService.getAuthIds(jobId)
    .then((data: any) => {
      console.log('API Response:', data);

      if (data && data.length > 0) {
        this.users = data.map(u => ({
          surname: u.surname,
          sidNo: u.seafarer_no,
          position: u.position,
          email: u.email,
          mobile: u.mobile,
          profileImage: u.profile_image,
          matchScore: u.match_score
        }));

      } else {
        this.users = [];
        this._messageService.showError('No suggestions found');
      }
    })
    .catch((error) => {
      console.error(error);
      this._messageService.showError('Action Failed');
    });


}

openProfile(user: any): void {
    const suggestion = this.jobSuggestionsForm.value.selectedJob;
    const sidNo = user.sidNo;
    const matchScore = user.matchScore;
    const dialogRef = this.dialog.open(SeafarerProfileComponent, {
      width: '900px',          // dialog width
      maxWidth: '95vw',        // shrinks on small screens
      height: '90vh',          // tall enough to scroll inside
      panelClass: 'seafarer-dialog-panel',
      data: {
        sidNo: sidNo,
        matchScore: matchScore
      }
    });
 
    // Handle what the user clicked in the dialog footer
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
 
      if (result.action === 'BOOK_APPOINTMENT') {
        // call your appointment / invite service
        console.log('Invite seafarer:', result.seafarer);
        this.router.navigate(['/seafarers/appointment'], {
          state: {
            seafarer: result.seafarer
          }
        });
      }
 
      if (result.action === 'REJECT') {
        // update suggestion status to REJECTED
        console.log('Reject seafarer:', result.seafarer);
      }
    });
  }
}