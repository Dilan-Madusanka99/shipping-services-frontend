import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JobPostingServiceService } from 'src/app/services/vessels/job-posting-service.service';
import { Router } from '@angular/router';
import { SeafarerProfileComponent } from 'src/app/seafarers/seafarer-profile/seafarer-profile.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-applied-jobs',
  standalone: false,
  templateUrl: './applied-jobs.component.html',
  styleUrl: './applied-jobs.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppliedJobsComponent {
  displayedColumns: string[] = ['seafarerName', 'vesselName', 'vesselType', 'position', 'appliedDate', 'jobCloseDate', 'status'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isSeafarerRole = false;

  statusOptions = [
  'PENDING',
  'INTERVIEW SCHEDULED',
  'REJECTED',
  'SELECTED',
  'CANCELED'
];

  constructor(
    private seafarersService: SeafarersServiceService,
    private messageService: MessageServiceService,
    private jobPostingService: JobPostingServiceService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isSeafarerRole = window.localStorage.getItem('role') === 'SEAFARER';

    this.displayedColumns = this.isSeafarerRole
    ? [
        'vesselName',
        'vesselType',
        'position',
        'appliedDate',
        'jobCloseDate',
        'status'
      ]
    : [
        'seafarerName',
        'vesselName',
        'vesselType',
        'position',
        'appliedDate',
        'jobCloseDate',
        'status',
        'action'
      ];


    this.populateData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public populateData(): void {
  try {
        if (window.localStorage.getItem('role') === 'SEAFARER') {
          this.jobPostingService.getAppliedJobsByRole(+window.localStorage.getItem('user_id')).subscribe({
            next: (data: any[]) => {
              if (data.length <= 0) {
                return;
              }
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            error: (error) => {
              this.messageService.showError('Action Failed With Error ' + error);
            }
          });
        } else {
          this.jobPostingService.getAllAppliedJobs().subscribe({
            next: (data: any[]) => {
              if (data.length <= 0) {
                return;
              }
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            error: (error) => {
              this.messageService.showError('Action Failed With Error ' + error);
            }
          });
        }
      } catch (error) {
      this.messageService.showError('Action Failed With Error ' + error);
    }
  }

  public refreshData(): void {
    this.populateData();
  }

  updateStatus(job: any): void {
    this.jobPostingService.updateStatus(job.id, job).subscribe({
      next: (data: any) => {
        if (!data) {
          return;
        }
      this.messageService.showSuccess('Status Updated Successfully!');
      },
      error: (error) => {
        this.messageService.showError('Action Failed With Error ' + error);
      }
    });
  }

  openSeafarerProfile(job: any): void {
    const urlTree = this.router.createUrlTree(
      ['/seafarers/seafarerDoc'],
      {
        queryParams: {
          id: job.seafarerId
        }
      }
    );

    window.open(this.router.serializeUrl(urlTree), '_blank');
  }

  goToAppointment(job: any): void {
    const urlTree = this.router.createUrlTree(
      ['/seafarers/appointment'],
      {
        queryParams: {
          id: job.seafarerId
        }
      }
    );

    window.open(this.router.serializeUrl(urlTree), '_blank');
  }

}
