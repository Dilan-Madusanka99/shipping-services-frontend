import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { JobPostingServiceService } from 'src/app/services/vessels/job-posting-service.service';
import { Job } from '../job-vacancies-model';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';

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
  isSeafarerRole = false;
  
  // disable apply when null
  hasSeafarerRegistration = false;
  checkingRegistration = true;

  constructor(
    private dialogRef: MatDialogRef<JobDetailsDialogComponent>,
    private jobService: JobPostingServiceService,
    private seafarerService: SeafarersServiceService,
    private httpService: HttpService,
    private _messageService: MessageServiceService,
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
    this.isSeafarerRole = this.httpService.getUserRole() === 'SEAFARER';

  if (this.isSeafarerRole) {  // disabled apply when null 
    this.checkSeafarerRegistration();
  } else {
    this.checkingRegistration = false;
  }
  }

  // disabled apply when null
  private checkSeafarerRegistration(): void {
    const seafarerId = this.httpService.getUserId();

    this.seafarerService.getSeafarerDataById(Number(seafarerId)).subscribe({
      next: (response) => {
        this.hasSeafarerRegistration = response != null;
        this.checkingRegistration = false;
      },
      error: () => {
        this.hasSeafarerRegistration = false;
        this.checkingRegistration = false;
      }
    });
  }

  apply(): void {
  if (!this.hasSeafarerRegistration) {
    this._messageService.showWarn(
      'Please complete your registration before applying.'
    );
    return;
  }

    if (this.applying || this.applied) {
      return;
    }
    this.applying = true;
    console.log(this.data.job);

    const saveObject = {
      seafarerId: this.httpService.getUserId(),
      seafarerName: this.httpService.getLoginNameFromCache(),
      jobId: this.data.job.id,
      position: this.data.job.position,
      vesselName: this.data.job.vesselName,
      vesselType: this.data.job.vesselType,
      status: 'PENDING',
      appliedDate: new Date(),
      jobCloseDate: new Date(this.data.job.closingDate)
    };

    /* Save to backend the data (Job ID, Seafarer ID, User ID, Status)*/
    this.jobService.apply(saveObject)
      .pipe(finalize(() => this.applying = false))
      .subscribe({
        next: () => {
          this.applied = true;
          // Close and let the list show the snackbar + badge the card
          this._messageService.showSuccess('You have successfully applied to the job! We will contact you soon!');
          this.dialogRef.close({ applied: true });
        },
        error: (error: any) => {
            this._messageService.showWarn(error);
          // this.snackBar.open(
          //   'Could not submit your application. Please try again.',
          //   'OK',
          //   { duration: 4000 }
          // );
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
