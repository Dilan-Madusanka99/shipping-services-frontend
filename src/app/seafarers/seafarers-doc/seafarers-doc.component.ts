import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { OtherDetailsRegistrationService } from 'src/app/services/seafarers/other-details-registration.service';
import { CertificatesRegistrationService } from 'src/app/services/seafarers/certificates-registration.service';
import { SeaServicesService } from 'src/app/services/seafarers/sea-services.service';

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

  // certificatesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private seafarersService: SeafarersServiceService,
    private otherDetailsService: OtherDetailsRegistrationService,
    private certificateDetailsService: CertificatesRegistrationService,
    private seaServicesService: SeaServicesService
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
      kiyellowFeverIssuedDatenName: [''],
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

  async downloadPDF() {
    const element = document.getElementById('formToPrint');
    if (!element) return;

    try {
      // Hide action buttons temporarily
      const actions = document.querySelector('.form-actions') as HTMLElement;
      const originalDisplay = actions?.style.display;
      if (actions) actions.style.display = 'none';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Restore action buttons
      if (actions) actions.style.display = originalDisplay || 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('user-details-form.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  public onSeafarersSelect(event): void {
    let selectedSeafarersId = event;

    this.patchFormSeafarersValues(selectedSeafarersId);
    this.loadOtherDetails(selectedSeafarersId);
    this.loadCertificateDetails(selectedSeafarersId);
    this.loadSeaServiceDetails(selectedSeafarersId);
  }

  public patchFormSeafarersValues(seafarersId: number): void {
    const seaFarer = this.allSeafarersListDetails.find((item: any) => item.id == seafarersId);

    this.userForm.patchValue({
      ...seaFarer
    });

    /* patch kin details */

    this.userForm.patchValue({
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
        sidIssuedDate: otherDetails.sidIssuedDate,
        sidExpireDate: otherDetails.sidExpireDate,
        ppNo: otherDetails.ppNo,
        ppIssuedPlace: otherDetails.ppIssuedPlace,
        ppIssuedDate: otherDetails.ppIssuedDate,
        ppExpireDate: otherDetails.ppExpireDate,
        cdcNo: otherDetails.cdcNo,
        cdcIssuedPlace: otherDetails.cdcIssuedPlace,
        cdcIssuedDate: otherDetails.cdcIssuedDate,
        cdcExpireDate: otherDetails.cdcExpireDate,
        yellowFeverNo: otherDetails.yellowFeverNo,
        yellowFeverIssuedPlace: otherDetails.yellowFeverIssuedPlace,
        kiyellowFeverIssuedDatenName: otherDetails.kiyellowFeverIssuedDatenName,
        yellowFeverExpireDate: otherDetails.yellowFeverExpireDate
      });
    }
  });
  }

  private loadCertificateDetails(selectedSeafarersId: number): void {
  this.certificateDetailsService.getBySeafarerId(selectedSeafarersId).subscribe((certificate: any) => {
    if (certificate) {
      this.userForm.patchValue({
        cName: certificate.cName,
        cNo: certificate.cNo,
        cIssuedPlace: certificate.cIssuedPlace,
        cIssuedDate: certificate.cIssuedDate,
        cExpiredDate: certificate.cExpiredDate
      });
    }
  });
  }

  private loadSeaServiceDetails(seafarersId: number): void {
  this.seaServicesService.getBySeafarerId(seafarersId).subscribe((seaService: any) => {
    if (seaService) {
      this.userForm.patchValue({
        companyName: seaService.companyName,
        vesselName: seaService.vesselName,
        vesselType: seaService.vesselType,
        flag: seaService.flag,
        grt: seaService.grt,
        bhp: seaService.bhp,
        signOn: seaService.signOn,
        signOff: seaService.signOff,
        totalMonths: seaService.totalMonths,
        reason: seaService.reason
      });
    }
  });
  }
}
