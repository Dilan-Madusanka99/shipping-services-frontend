import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { JobPostingServiceService } from 'src/app/services/vessels/job-posting-service.service';
import { Job } from '../job-vacancies-model';

export interface JobDetailsDialogData {
  job: Job & { imageSrc?: string | null };
  alreadyApplied: boolean;
}

@Component({
  selector: 'app-job-details-dialog',
  templateUrl: './job-details-dialog.component.html',
  styleUrls: ['./job-details-dialog.component.scss']
})
export class JobDetailsDialogComponent implements OnInit {

  job: Job & { imageSrc?: string | null };

  /**
   * Set from the backend's boolean-only match endpoint.
   * The raw score never reaches this component — by design.
   */
  perfectMatch = false;

  applying = false;
  applied = false;

  constructor(
    private dialogRef: MatDialogRef<JobDetailsDialogComponent>,
    private jobService: JobPostingServiceService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: JobDetailsDialogData
  ) {
    this.job = data.job;
    this.applied = data.alreadyApplied;
  }

  ngOnInit(): void {
    // this.jobService.getMatchStatus(this.job.id).subscribe({
    //   next: res => this.perfectMatch = res.perfectMatch,
    //   error: () => this.perfectMatch = false // fail silently — banner just doesn't show
    // });
  }

  apply(): void {
    if (this.applying || this.applied) {
      return;
    }

    this.applying = true;

    // this.jobService.apply({ jobId: this.job.id })
    //   .pipe(finalize(() => this.applying = false))
    //   .subscribe({
    //     next: () => {
    //       this.applied = true;
    //       // Close and let the list show the snackbar + badge the card
    //       this.dialogRef.close({ applied: true });
    //     },
    //     error: () => {
    //       this.snackBar.open(
    //         'Could not submit your application. Please try again.',
    //         'OK',
    //         { duration: 4000 }
    //       );
    //     }
    //   });
  }

  close(): void {
    this.dialogRef.close();
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
