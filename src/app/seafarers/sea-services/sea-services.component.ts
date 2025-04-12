import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SeaServicesService } from 'src/app/services/seafarers/sea-services.service';

export interface PeriodicElement {
  sidNo: string;
  vesselName: string;
  vesselType: string;
  position: string;
}

const ELEMENT_DATA: any[] = [ 
  {sidNo: 'S123', vesselName: 'souselas', vesselType: 'bulk', position: 'AB'},
];


@Component({
  selector: 'app-sea-services',
  standalone: false,
  templateUrl: './sea-services.component.html',
  styleUrl: './sea-services.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeaServicesComponent implements OnInit{

  seaServicesForm : FormGroup;

    displayedColumns: string[] = ['sidNo', 'vesselName', 'vesselType', 'position', 'actions'];
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selected: String;
    saveButtonLabel = 'Save';
    mode = 'add';
    selectedData;
    isButtonDisabled = false;

    constructor(private fb: FormBuilder, private seaServicesService: SeaServicesService, private messageService: MessageServiceService) {
      this.seaServicesForm = this.fb.group({
        sidNo: new FormControl(''),
        companyName: new FormControl(''),
        vesselName: new FormControl(''),
        position: new FormControl(''),
        vesselType: new FormControl(''),
        flag: new FormControl(''),
        grt: new FormControl(''),
        bhp: new FormControl(''),
        signOn: new FormControl(''),
        signOff: new FormControl(''),
        totalMonths: new FormControl(''),
        reason: new FormControl('')
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
        this.seaServicesService.getData().subscribe({
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
          console.log(this.seaServicesForm.value);
  
          if (this.mode === 'add'){
            this.seaServicesService.serviceCall(this.seaServicesForm.value).subscribe({
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
            this.seaServicesService.editData(this.selectedData?.id, this.seaServicesForm.value).subscribe ({
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
          this.seaServicesForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.seaServicesForm.reset();
        this.saveButtonLabel = 'Save';
        this.seaServicesForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.seaServicesForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.seaServicesService.deleteData(id).subscribe ({
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
