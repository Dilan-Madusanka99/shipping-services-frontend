import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { VesselRegistrationService } from 'src/app/services/vessels/vessel-registration.service';

export interface PeriodicElement {
  vesselName: string;
  imoNo: String;
  vesselType: string;
  flag: string;
}

const ELEMENT_DATA: any[] = [ 
  {vesselName: 'Dacil', imoNo: 'souselas', vesselType: 'bulk', flag: 'portugal'},
];

@Component({
  selector: 'app-vessel-registration',
  standalone: false,
  templateUrl: './vessel-registration.component.html',
  styleUrl: './vessel-registration.component.scss'
}) 
export class VesselRegistrationComponent implements OnInit {

  vesselRegistrationForm : FormGroup;

  displayedColumns: string[] = ['vesselName', 'imoNo', 'vesselType', 'Flag', 'actions'];
      dataSource: MatTableDataSource<any>;
      @ViewChild(MatPaginator) paginator: MatPaginator;
      @ViewChild(MatSort) sort: MatSort;
      selected: String;
      saveButtonLabel = 'Save';
      mode = 'add';
      selectedData;
      isButtonDisabled = false;

      constructor(private fb: FormBuilder, private vesselRegistrationService: VesselRegistrationService, private messageService: MessageServiceService) {
            this.vesselRegistrationForm = this.fb.group({
              vesselName: new FormControl(''),
              imoNo: new FormControl(''),
              vesselType: new FormControl(''),
              flag: new FormControl(''),
              yob: new FormControl(''),
              grt: new FormControl(''),
              bhp: new FormControl('')
            });
          }

      ngOnInit(): void{
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
        this.vesselRegistrationService.getData().subscribe({
          next: (dataList: any[]) => {
            if (dataList.length <=0) {
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
      } catch (error) {
        this.messageService.showError('Action Failed With Error ' + error);
      }
    }
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.vesselRegistrationForm.value);
  
          if (this.mode === 'add'){
            this.vesselRegistrationService.serviceCall(this.vesselRegistrationForm.value).subscribe({
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
          }
          else if (this.mode === 'edit'){
            this.vesselRegistrationService.editData(this.selectedData?.id, this.vesselRegistrationForm.value).subscribe ({
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
          this.vesselRegistrationForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.vesselRegistrationForm.reset();
        this.saveButtonLabel = 'Save';
        this.vesselRegistrationForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.vesselRegistrationForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.vesselRegistrationService.deleteData(id).subscribe ({
            next: (response: any) => {
              const index = this.dataSource.data.findIndex((element) => element.id === id);
    
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource = new MatTableDataSource (this.dataSource.data);
            this.messageService.showSuccess('Data Deleted Successfully!');
            },
            error: (error: any) => {
              this.messageService.showError('Action Failed With Error' + error);
            }
          });
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public refreshData(): void {
        this.populateData();
      } 

}
