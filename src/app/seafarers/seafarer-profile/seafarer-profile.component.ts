import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';


@Component({
  selector: 'app-seafarer-profile',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './seafarer-profile.component.html',
  styleUrls: ['./seafarer-profile.component.scss']
})
export class SeafarerProfileComponent implements OnInit {

  seafarer: any = null;
  certificates: any[] = [];
  seaServices: any[] = [];

  constructor(private route: ActivatedRoute, private dialogRef: MatDialogRef<SeafarerProfileComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data.sidNo); /* sidNo -> data.sidNo */
    this.populateData();
  }

  populateData() {
    // Sample data for local testing
    this.seafarer = {
      name: 'Ruwan Perera',
      position: 'Chief Officer',
      dob: '1988-04-15',
      nic: '882061234V',
      religion: 'Buddhist',
      gender: 'Male',
      maritalStatus: 'Married',
      address: 'No. 45, Galle Road, Colombo 03',
      homePhone: '+94 11 234 5678',
      mobile: '+94 77 123 4567',
      email: 'ruwan.perera@email.com',
      photo: null,
      sidNo: 'SF-20240023',
      sidIssuedPlace: 'Colombo',
      sidIssuedDate: '2020-01-10',
      sidExpiredDate: '2025-01-10',
      sidImage: null,
      passportNo: 'N1234567',
      passportIssuedPlace: 'Colombo',
      passportIssuedDate: '2019-06-01',
      passportExpireDate: '2029-06-01',
      passportImage: null,
      seamanBookNo: 'SB-789456',
      seamanIssuedPlace: 'Colombo',
      seamanIssuedDate: '2018-03-20',
      seamanExpireDate: '2023-03-20',
      seamanBookImage: null,
      yellowFeverNo: 'YF-00123',
      yellowFeverIssuedPlace: 'Colombo',
      yellowFeverIssuedDate: '2022-07-15',
      yellowFeverExpireDate: '2032-07-15',
      yellowFeverImage: null,
    };

    this.certificates = [
      {
        name: 'STCW Basic Safety Training',
        certNo: 'STCW-2021-001',
        issuedPlace: 'Colombo',
        issuedDate: '2021-03-10',
        expiredDate: '2026-03-10',
        image: null
      },
      {
        name: 'Certificate of Competency - Chief Officer',
        certNo: 'CoC-2020-045',
        issuedPlace: 'Colombo',
        issuedDate: '2020-09-05',
        expiredDate: '2025-09-05',
        image: null
      }
    ];

    this.seaServices = [
      {
        companyName: 'Lanka Shipping Ltd.',
        vesselName: 'MV Serendib',
        vesselType: 'Bulk Carrier',
        position: 'Chief Officer',
        totalMonths: 18,
        signOffReason: 'Contract End'
      },
      {
        companyName: 'Ocean Carriers Pvt Ltd.',
        vesselName: 'MV Pacific Star',
        vesselType: 'Tanker',
        position: 'Second Officer',
        totalMonths: 24,
        signOffReason: 'Promotion'
      }
    ];
  }

  isExpired(dateStr: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  close(): void {
  this.dialogRef.close();
}
}
