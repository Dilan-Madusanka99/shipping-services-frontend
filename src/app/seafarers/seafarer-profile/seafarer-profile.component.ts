import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { OtherDetailsRegistrationService } from 'src/app/services/seafarers/other-details-registration.service';
import { CertificatesRegistrationService } from 'src/app/services/seafarers/certificates-registration.service';
import { SeaServicesService } from 'src/app/services/seafarers/sea-services.service';


@Component({
  selector: 'app-seafarer-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './seafarer-profile.component.html',
  styleUrls: ['./seafarer-profile.component.scss']
})
export class SeafarerProfileComponent implements OnInit {

  seafarer: any = null;
  otherDetails: any = null;
  certificates: any[] = [];
  seaServices: any[] = [];
  seaFarerIdNo: any;

  constructor(private route: ActivatedRoute, 
              private dialogRef: MatDialogRef<SeafarerProfileComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private seafarersService: SeafarersServiceService,
              private otherSeafarerService: OtherDetailsRegistrationService,
              private certificatesService: CertificatesRegistrationService,
              private seaServicesService: SeaServicesService) {}

  ngOnInit(): void {
    const sidNo = this.data.sidNo;
    this.seaFarerIdNo = sidNo;

    console.log('SID No:', sidNo);
    if (sidNo) {
      this.loadSeafarerData(sidNo);
      this.loadOtherSeafarerData(sidNo);
      this.loadCertificatesData(sidNo);
      this.loadSeaServicesData(sidNo);
    }
  }

  loadSeafarerData(sidNo: string) {
    this.seafarersService.getSeafarerData(sidNo).subscribe({
      next: (data: any) => {
        console.log('Seafarer API Response:', data);

        const dataResponse = data.seafarer || data;

        this.seafarer = {
          ...this.seafarer,
          ...dataResponse
        };
        this.seafarer.sidNo = dataResponse.sidNo;
      },
      error: (err) => {
        console.error('Error loading seafarer data', err);
      }
    });
  }

  loadOtherSeafarerData(sidNo: string) {
    this.otherSeafarerService.getSeafarerData(sidNo).subscribe({
      next: (data: any) => {
        console.log('Other Details API Response::', data);

        const dataResponse = data.otherDetails  || data;
        this.seafarer = {
          ...this.seafarer,
          ...dataResponse
        }
      },
      error: (err) => {
        console.error('Error loading other details data', err);
      }
    });
  }

    loadCertificatesData(sidNo: string) {
    this.certificatesService.getSeafarerData(sidNo).subscribe({
      next: (data: any) => {
        console.log('Certificates API Response::', data);

        this.certificates = data.certificates  || data;
      },
      error: (err) => {
        console.error('Error loading certificates data', err);
      }
    });
  }

    loadSeaServicesData(sidNo: string) {
    this.seaServicesService.getSeafarerData(sidNo).subscribe({
      next: (data: any) => {
        console.log('Sea Services API Response::', data);

        this.seaServices = data.seaServices  || data;
      },
      error: (err) => {
        console.error('Error loading sea services data', err);
      }
    });
  }



  isExpired(dateStr: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  close(): void {
  this.dialogRef.close();
}

}
