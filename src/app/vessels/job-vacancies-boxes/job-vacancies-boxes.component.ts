import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Job } from './job-vacancies-model';
import { JobPostingServiceService } from 'src/app/services/vessels/job-posting-service.service';
import { finalize } from 'rxjs';
import { VesselRegistrationService } from 'src/app/services/vessels/vessel-registration.service';
import { JobDetailsDialogComponent } from './job-details-dialog/job-details-dialog.component';

@Component({
  selector: 'app-job-vacancies-boxes',
  templateUrl: './job-vacancies-boxes.component.html',
  styleUrl: './job-vacancies-boxes.component.scss'
})
export class JobVacanciesBoxesComponent {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  vesselTypes: any[] = [];
  appliedJobIds = new Set<number>();

  searchTerm = '';
  selectedVesselType = 'ALL';

  loading = false;
  loadError = false;

  vessleData: any;

  constructor(
    private jobService: JobPostingServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private vessleService: VesselRegistrationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.vessleService.getData().subscribe((response: any) => {
      this.vessleData = response;
      this.loadJobs();
    });
  }

  loadJobs(): void {
    this.loading = true;
    this.loadError = false;

    this.jobService.getOpenJobs()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (jobs: any) => {
          this.jobs = this.populateJob(jobs);
          this.vesselTypes = [...new Set(jobs.map((j: any) => j.vesselType))].sort();
          this.applyFilters();
        },
        error: () => this.loadError = true
      });
  }

  public populateJob(job: any[]): any {
    const jobArray: Job[] = [];
    job.forEach((jobV: any) => {
      const jobItem: Job = {
        id: jobV.id,
        vesselName: this.vessleData.find((vessleItem: any) => vessleItem.id == jobV.vesselName)?.vesselName,
        vesselType: jobV.vesselType,
        position: jobV.position,
        requiredCertificates: jobV.cName?.split(','),
        minimumExperience: jobV.minimumExp,
        jobStatus: jobV.jobStatus,
        description: jobV.jobDescription,
        closingDate: jobV.jobClosingDate,
        image: jobV.jobPostImage ? `data:image/png;base64,${jobV.jobPostImage}` : null
      };
      jobArray.push(jobItem);
    }); 
    return jobArray;
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredJobs = this.jobs.filter(job => {
      const matchesType = this.selectedVesselType === 'ALL'
        || job.vesselType === this.selectedVesselType;

      const matchesTerm = !term
        || job.vesselName.toLowerCase().includes(term)
        || job.position.toLowerCase().includes(term);

      return matchesType && matchesTerm;
    });
  }

  openJobDetails(job: Job): void {
    const dialogRef = this.dialog.open(JobDetailsDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'job-details-panel',
      data: { job, alreadyApplied: this.appliedJobIds.has(job.id) }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.applied) {
        this.appliedJobIds.add(job.id);
        this.snackBar.open(
          `Application submitted for ${job.position} — ${job.vesselName}`,
          'OK',
          { duration: 4000 }
        );
      }
    });
  }

  onImageError(event: Event): void {
    // Hide broken image so the CSS placeholder background shows instead
    (event.target as HTMLImageElement).style.display = 'none';
  }

  daysUntilClosing(closingDate: string): number {
    const closing = new Date(closingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((closing.getTime() - today.getTime()) / 86_400_000);
  }

  trackByJobId(_: number, job: Job): number {
    return job.id;
  }

}
