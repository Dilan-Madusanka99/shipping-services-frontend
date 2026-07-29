import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { OnboardCrewRegistrationService } from 'src/app/services/onboard/onboard-crew-registration.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { StandbyCrewMembersServiceService } from 'src/app/services/vessels/standby-crew-members-service.service';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  sidNo: String;
  position: String;
  status: String;
}

const ELEMENT_DATA: any[] = [{ sidNo: 'S123', position: 'AB', status: 'active' }];

@Component({
  selector: 'app-standby-crew-members',
  standalone: false,
  templateUrl: './standby-crew-members.component.html',
  styleUrl: './standby-crew-members.component.scss'
})
export class StandbyCrewMembersComponent {
  standbyCrewMembersForm: FormGroup;
  
    displayedColumns: string[] = ['sidNo', 'position', 'status', 'actions'];
  
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    isButtonDisabled = false;
    selectedSeafarers: string = ''; // sid link
    allSeafarersDropdown: any = []; 
    seafarersDropdown: any = [];
    allSeafarersListDetails: any;
    selectedVessel: string = ''; // vessel link
    allVesselDropdown: any = []; 
    vesselDropdown: any = [];
    allVesselListDetails: any;
    sidMap = new Map<number, string>(); // [step 1]
  
    constructor(
      private fb: FormBuilder,
      private standbyCrewMembersServiceService: OnboardCrewRegistrationService,
      private messageService: MessageServiceService,
      private seafarerService: SeafarersServiceService
    ) {
      this.standbyCrewMembersForm = this.fb.group({
        sidNo: new FormControl('', [Validators.required]),
        position: new FormControl('', [Validators.required]),
        status: new FormControl('', [Validators.required])
      });
    }
  
    ngOnInit(): void {
      this.getSeafarersList();
    }
  
    // sid link
    public getSeafarersList(): void {
      this.seafarerService.getData().subscribe((response: any) => {
        if (response && response.length > 0) {
          this.allSeafarersListDetails = response;
          response.forEach((seafarers: any) => {
            const seafarersData = {
              id: seafarers.id,
              sidNo: seafarers.sidNo
            };
            this.allSeafarersDropdown.push(seafarersData);
          });
        }
        this.seafarersDropdown = this.allSeafarersDropdown;
        this.createSidMap(); // [step 2]
  
        // this.setSeafearersNoOnTable();
      });
    }
  
    public setSeafearersNoOnTable(): void {
      let tabData = this.dataSource.data;
      let newData: any[] = [];
  
      this.allSeafarersDropdown.forEach((seaFarer: any) => {
        const tabItem = tabData.find((item: any) => +item.sidNo === seaFarer.id);
        tabItem.sidName = seaFarer.sidNo;
        newData.push(tabItem);
      });
  
      this.dataSource = new MatTableDataSource(newData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  
    // [step 3]
    public createSidMap(): void {
      this.allSeafarersListDetails.forEach((seaFarer: any) => {
        this.sidMap.set(seaFarer.id, seaFarer.sidNo);
      });
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
          /* If the role is seafarer then get only details related to SID no*/ 
          this.standbyCrewMembersServiceService.getSeafarerData(window.localStorage.getItem('sid')).subscribe({
            next: (data) => {
              if (!data) {
                return;
              }
  
              this.dataSource = new MatTableDataSource([data]);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            error: (error) => {
              this.messageService.showError('Action Failed With Error ' + error);
            }
          });
        } else {
          this.standbyCrewMembersServiceService.getInactiveData().subscribe({
            next: (dataList: any[]) => {
              if (dataList.length <= 0) {
                return;
              }
  
              this.dataSource = new MatTableDataSource(dataList);
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
  
    onSubmit() {
      try {
        console.log('mode' + this.mode);
        console.log('Form Submitted');
        console.log(this.standbyCrewMembersForm.value);
  
        // if(!this.standbyCrewMembersForm.valid) return;
        if (this.mode === 'add') {
          this.standbyCrewMembersServiceService.serviceCall(this.standbyCrewMembersForm.value).subscribe({
            next: (response: any) => {
              if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
                this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
              } else {
                this.dataSource = new MatTableDataSource([response, ...this.dataSource.data]);
              }
  
              this.messageService.showSuccess('Data Saved Successfully!');
            },
            error: (error) => {
              this.messageService.showError('Action Failed With Error' + error);
            }
          });
        } else if (this.mode === 'edit') {
          this.standbyCrewMembersServiceService.editData(
            this.selectedData?.id, this.standbyCrewMembersForm.value
          ).subscribe({
            next: (response: any) => {
              let elementIndex = this.dataSource.data.findIndex((element) => element.id === this.selectedData?.id);
              this.dataSource.data[elementIndex] = response;
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.messageService.showSuccess('Data Edited Successfully!');
            },
            error: (error) => {
              this.messageService.showError('Action Failed With Error' + error);
            }
          });
        }
        this.mode = 'add';
        this.standbyCrewMembersForm.disable();
        this.isButtonDisabled = true;
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }
  
    public resetData(): void {
      this.standbyCrewMembersForm.reset();
      this.saveButtonLabel = 'Save';
      this.standbyCrewMembersForm.enable();
      this.isButtonDisabled = false;
    }
  
    public editData(data: any): void {
      this.standbyCrewMembersForm.patchValue(data);
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectedData = data;
  
      this.standbyCrewMembersForm.patchValue({
        sidNo: +data.sidNo,
        imoNo: +data.imoNo,
        signOnDate: new Date(data.signOnDate).toISOString().substring(0, 10),
        signOffDate: new Date(data.signOffDate).toISOString().substring(0, 10)
      });
    }
  
    public deleteData(data: any): void {
      const id = data.id;
  
      try {
            Swal.fire({
              title: 'Are you sure?',
              text: 'You want to delete this?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result && !result.isConfirmed) {
                return;
              }
              
        this.standbyCrewMembersServiceService.deleteData(id).subscribe({
          next: (response: any) => {
            const index = this.dataSource.data.findIndex((element) => element.id === id);
  
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource(this.dataSource.data);
            this.messageService.showSuccess('Data Deleted Successfully!');
          },
          error: (error: any) => {
            this.messageService.showError('Action Failed With Error' + error);
          }
        });
  
      });
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }
  
    public refreshData(): void {
      this.populateData();
      // this.setSeafearersNoOnTable();
    }
  
    // sid link
    onSeafarerKey(eventTarget: any) {
      this.seafarersDropdown = this.seafarerSearch(eventTarget.value);
    }
  
    seafarerSearch(value: string) {
      let filter = value.toLowerCase();
      return this.allSeafarersDropdown.filter((option: any) => option.sidNo.toLowerCase().startsWith(filter));
    }
  
    public onSeafarersSelect(event): void {
      let selectedSeafarersId = event;
  
      this.patchFormSeafarersValues(selectedSeafarersId);
    }
  
    public patchFormSeafarersValues(seafarersId: number): void {
      this.standbyCrewMembersForm.patchValue({
        sidNo: seafarersId
      });
    }

}
