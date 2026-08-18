import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { OtherDetailsRegistrationService } from 'src/app/services/seafarers/other-details-registration.service';
import { CertificatesRegistrationService } from 'src/app/services/seafarers/certificates-registration.service';
import { SeaServicesService } from 'src/app/services/seafarers/sea-services.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seafarers-doc',
  standalone: false,
  templateUrl: './seafarers-doc.component.html',
  styleUrl: './seafarers-doc.component.scss'
})
export class SeafarersDocComponent {
  userForm!: FormGroup;
  showSuccessMessage = false;
  selectedSeafarers: string = '';
  allSeafarersDropdown: any = [];
  seafarersDropdown: any = [];
  allSeafarersListDetails: any;

  certificatesList: any[] = []; // added
  seaServicesList: any[] = [];

  isSidDisabled = false;

  constructor(
    private fb: FormBuilder,
    private seafarersService: SeafarersServiceService,
    private otherDetailsService: OtherDetailsRegistrationService,
    private certificateDetailsService: CertificatesRegistrationService,
    private seaServicesService: SeaServicesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getSeafarersList();
  }

  public getSeafarersList(): void {
    this.seafarersService.getData().subscribe((response: any) => {  
      if (response && response.length > 0) {
        this.allSeafarersListDetails = response;
        response.forEach((seafarers: any) => {
          const seafarersData = {
            id: seafarers.id,
            sidNo: seafarers.sidNo
            // otherDetails: seafarers.otherDetails,            
            // certificateDetails: seafarers.certificateDetails
          };
          this.allSeafarersDropdown.push(seafarersData);
        });
      }
      // this.certificatesList = certs;
      this.seafarersDropdown = this.allSeafarersDropdown;
      this.isSeafarerView();
      this.route.queryParams.subscribe(params => {
      const seafarerId = params['id'];
        if (seafarerId) {
          this.isRouteFromAppliedJobs(seafarerId);
        }
      });
    });
  }

  initializeForm() {
    this.userForm = this.fb.group({
      // Personal Details
      position: [''],
      appliedDate: [''],
      availableDate: [''],
      birthDate: [''],
      surname: [''],
      otherNames: [''],
      dob: [''],
      birthPlace: [''],
      nic: [''],
      religion: [''],
      gender: [''],
      marriedStatus: [''],
      noOfChildren: [''],
      address: [''],
      home: [''],
      mobile: [''],
      email: [''],
      kinName: [''],
      kinRelationship: [''],
      kinAddress: [''],
      kinMobile: [''],
      kinEmail: [''],
      englishLanguage: [''],
      profileImage: [''],
      profileImageName: [''],
      profileImageType: [''],
      // Other Details (Document Details)
      sidNo: [''],
      sidIssuedPlace: [''],
      sidIssuedDate: [''],
      sidExpireDate: [''],
      ppNo: [''],
      ppIssuedPlace: [''],
      ppIssuedDate: [''],
      ppExpireDate: [''],
      cdcNo: [''],
      cdcIssuedPlace: [''],
      cdcIssuedDate: [''],
      cdcExpireDate: [''],
      yellowFeverNo: [''],
      yellowFeverIssuedPlace: [''],
      yellowFeverIssuedDate: [''],
      yellowFeverExpireDate: [''],
      // Certificate Details
      cName: [''],
      cNo: [''],
      cIssuedPlace: [''],
      cIssuedDate: [''],
      cExpiredDate: [''],
      //  Sea Services
      companyName: [''],
      vesselName: [''],
      // position: [''],
      vesselType: [''],
      flag: [''],
      grt: [''],
      bhp: [''],
      signOn: [''],
      signOff: [''],
      totalMonths: [''],
      reason: [''],
    });

    this.userForm.disable();
  }

  public isSeafarerView(): void {
    const sid = window.localStorage.getItem('sid');
  
    if (sid) {
      const selectedObject = this.seafarersDropdown.find(
        (seaFarer: any) => seaFarer.sidNo === sid
      );
    
      if (selectedObject) {
        this.selectedSeafarers = selectedObject.id;
        this.isSidDisabled = true;
        this.onSeafarersSelect(selectedObject.id);
      }
    } else {
        this.isSidDisabled = false;
      }
  }

  public isRouteFromAppliedJobs(sidNo: any): void {
    if (sidNo) {
      const selectedObject = this.seafarersDropdown.find(
        (seaFarer: any) => seaFarer.sidNo === sidNo
      );
    console.log('selectedObject: ' + selectedObject);
      if (selectedObject) {
        this.selectedSeafarers = selectedObject.id;
        this.isSidDisabled = true;
        this.onSeafarersSelect(selectedObject.id);
      }
    } else {
        this.isSidDisabled = false;
      }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  saveForm() {
    if (this.userForm.valid) {
      console.log('Form Data:', this.userForm.value);
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm() {
    this.userForm.reset();
    this.showSuccessMessage = false;
  }

  markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  downloadPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const v = this.userForm.value;
    let y = 20;
    
    const section = (title: string) => {
      if (y > 265) { pdf.addPage(); y = 20; }
      pdf.setFontSize(14); pdf.setFont('', 'bold');
      pdf.text(title, 15, y); y += 8;
      pdf.setFontSize(11); pdf.setFont('', 'normal');
    };
  
    const row = (label: string, value: any) => {
      if (y > 280) { pdf.addPage(); y = 20; }
      pdf.text(`${label}:`, 15, y);
      pdf.text(`${value ?? ''}`, 70, y);
      y += 7;
    };
  
    pdf.setFontSize(18); pdf.text('Seafarer Document', 15, y); y += 12;
  
    section('Personal Details');
    row('Position', v.position);
    row('Applied Date', v.appliedDate);
    row('Available Date', v.availableDate);
    row('Surname', v.surname);
    row('Other Names', v.otherNames);
    row('Date of Birth', v.dob);
    row('Birth Place', v.birthPlace);
    row('NIC', v.nic);
    row('Religion', v.religion);
    row('Gender', v.gender);
    row('Married Status', v.marriedStatus);
    row('No of Children', v.noOfChildren);
    y += 4;
  
    section('Contact Details');
    row('Address', v.address);
    row('Home', v.home);
    row('Mobile', v.mobile);
    row('Email', v.email);
    y += 4;
  
    section('Next of Kin Details');
    row('Kin Name', v.kinName);
    row('Kin Relationship', v.kinRelationship);
    row('Kin Address', v.kinAddress);
    row('Kin Mobile', v.kinMobile);
    row('Kin Email', v.kinEmail);
    y += 4;
  
    section('Seafarer ID');
    row('SID No', v.sidNo);
    row('Issued Place', v.sidIssuedPlace);
    row('Issued Date', v.sidIssuedDate);
    row('Expiry Date', v.sidExpireDate);
    y += 4;
  
    section('Passport');
    row('Passport No', v.ppNo);
    row('Issued Place', v.ppIssuedPlace);
    row('Issued Date', v.ppIssuedDate);
    row('Expiry Date', v.ppExpireDate);
    y += 4;
  
    section('Seaman Book (CDC)');
    row('Book No', v.cdcNo);
    row('Issued Place', v.cdcIssuedPlace);
    row('Issued Date', v.cdcIssuedDate);
    row('Expiry Date', v.cdcExpireDate);
    y += 4;
  
    section('Yellow Fever');
    row('Certificate No', v.yellowFeverNo);
    row('Issued Place', v.yellowFeverIssuedPlace);
    row('Issued Date', v.yellowFeverIssuedDate);
    row('Expiry Date', v.yellowFeverExpireDate);
    y += 4;
  
    // ---------- Certificates (array) ----------
    section(`Certificates (${this.certificatesList.length})`);
    if (this.certificatesList.length === 0) {
      row('', 'No certificates registered.');
    } else {
      this.certificatesList.forEach((cert, i) => {
        if (y > 275) { pdf.addPage(); y = 20; }
        pdf.setFont('', 'bold');
        pdf.text(`${i + 1}. ${cert.cName || '—'}`, 15, y);
        pdf.setFont('', 'normal');
        y += 7;
        row('   Certificate No', cert.cNo);
        row('   Issued Place', cert.cIssuedPlace);
        row('   Issued Date', this.formatDateValue(cert.cIssuedDate));
        row('   Expiry Date', this.formatDateValue(cert.cExpiredDate));
        y += 2;
      });
    }
    y += 4;
  
    // ---------- Sea Services (array) ----------
    section(`Sea Services (${this.seaServicesList.length})`);
    if (this.seaServicesList.length === 0) {
      row('', 'No sea service records found.');
    } else {
      this.seaServicesList.forEach((svc, i) => {
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.setFont('', 'bold');
        pdf.text(`${i + 1}. ${svc.vesselName || '—'} (${svc.companyName || '—'})`, 15, y);
        pdf.setFont('', 'normal');
        y += 7;
        row('   Vessel Type', svc.vesselType);
        row('   Position', svc.position);
        row('   Flag', svc.flag);
        row('   GRT', svc.grt);
        row('   Sign On', this.formatDateValue(svc.signOn));
        row('   Sign Off', this.formatDateValue(svc.signOff));
        row('   Total Service', this.calculateTotal(svc.signOn, svc.signOff));
        y += 2;
      });
    }
  
    pdf.save('seafarer-document.pdf');
  }

  public onSeafarersSelect(event): void {
    let selectedSeafarersId = event;

    this.patchFormSeafarersValues(selectedSeafarersId);
    this.loadOtherDetails(selectedSeafarersId);
    this.loadCertificateDetails(selectedSeafarersId);
    this.loadSeaServiceDetails(selectedSeafarersId);
  }

  public patchFormSeafarersValues(seafarersId: number): void {
    const seaFarer = this.allSeafarersListDetails.find(
      (item: any) => item.id == seafarersId
    );
    if (!seaFarer) {
      return;
    }
    this.userForm.patchValue({
      ...seaFarer,
      // Format dates
      appliedDate: this.formatDateValue(seaFarer.appliedDate),
      availableDate: this.formatDateValue(seaFarer.availableDate),
      birthDate: this.formatDateValue(seaFarer.birthDate),
      dob: this.formatDateValue(seaFarer.dob),
      // Kin details
      kinName: seaFarer.kinName,
      kinRelationship: seaFarer.kinRelationship,
      kinAddress: seaFarer.kinAddress,
      kinMobile: seaFarer.kinMobile,
      kinEmail: seaFarer.kinEmail
    });
    console.log(this.userForm.value);
  }

  onKey(eventTarget: any) {
    this.seafarersDropdown = this.search(eventTarget.value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.allSeafarersDropdown.filter((option: any) => option.sidNo.toLowerCase().startsWith(filter));
  }

  public refreshData(): void {
    // this.populateData();
  }

  private loadOtherDetails(selectedSeafarersId: number): void {
  this.otherDetailsService.getBySeafarerId(selectedSeafarersId).subscribe((otherDetails: any) => {
    if (otherDetails) {
        this.userForm.patchValue({
          sidNo: otherDetails.sidNo,
          sidIssuedPlace: otherDetails.sidIssuedPlace,
          sidIssuedDate: this.formatDateValue(otherDetails.sidIssuedDate),
          sidExpireDate: this.formatDateValue(otherDetails.sidExpireDate),

          ppNo: otherDetails.ppNo,
          ppIssuedPlace: otherDetails.ppIssuedPlace,
          ppIssuedDate: this.formatDateValue(otherDetails.ppIssuedDate),
          ppExpireDate: this.formatDateValue(otherDetails.ppExpireDate),

          cdcNo: otherDetails.cdcNo,
          cdcIssuedPlace: otherDetails.cdcIssuedPlace,
          cdcIssuedDate: this.formatDateValue(otherDetails.cdcIssuedDate),
          cdcExpireDate: this.formatDateValue(otherDetails.cdcExpireDate),

          yellowFeverNo: otherDetails.yellowFeverNo,
          yellowFeverIssuedPlace: otherDetails.yellowFeverIssuedPlace,
          yellowFeverIssuedDate: this.formatDateValue(
            otherDetails.yellowFeverIssuedDate
          ),
          yellowFeverExpireDate: this.formatDateValue(
            otherDetails.yellowFeverExpireDate
          )
        });
    }
  });
  }

  private loadCertificateDetails(selectedSeafarersId: number): void {
    this.certificateDetailsService.getBySeafarerId(selectedSeafarersId).subscribe((certificate: any) => {
      // Endpoint may return a single object or an array — normalise to a list
      this.certificatesList = certificate
        ? (Array.isArray(certificate) ? certificate : [certificate])
        : [];
    });
  }

  isExpired(dateStr: string): boolean {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  private loadSeaServiceDetails(seafarersId: number): void {
    this.seaServicesService.getBySeafarerId(seafarersId).subscribe((seaService: any) => {
      // Endpoint may return a single object or an array — normalise to a list
      this.seaServicesList = seaService
        ? (Array.isArray(seaService) ? seaService : [seaService])
        : [];
    });
  }

 // dates formated
  private formatDateValue(value: any): string {
    if (!value) {
      return '';
    }

    try {
      return formatDate(value, 'dd/MM/yyyy', 'en-GB');
    } catch (error) {
      console.error('Invalid date:', value);
      return '';
    }
  }

calculateTotal(signOn: any, signOff: any): string {
  if (!signOn || !signOff) return '—';

  const start = new Date(signOn);
  const end = new Date(signOff);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return '—';

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  let days = end.getDate() - start.getDate();

  // Borrow days from the previous month when the day-of-month is negative
  if (days < 0) {
    months--;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) months = 0;

  return `${months} M ${days} D`;
}
}
