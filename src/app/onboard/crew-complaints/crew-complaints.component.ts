import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { CrewComplaintsService } from 'src/app/services/onboard/crew-complaints.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';

export interface PeriodicElement {
  sidNo: string;
  vesselName: string;
  complaintDate: number;
  complaintType: string;
}

const ELEMENT_DATA: any[] = [{ sidNo: 'S001', vesselName: 'M/T DonJuan', complaintDate: '9/7/2025', complaintType: 'Drug & Alcohol' }];

@Component({
  selector: 'app-crew-complaints',
  standalone: false,
  templateUrl: './crew-complaints.component.html',
  styleUrl: './crew-complaints.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrewComplaintsComponent {

  crewComplaintsForm: FormGroup;

  displayedColumns: string[] = ['sidNo', 'vesselName', 'complaintDate', 'complaintType', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: String;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  isButtonDisabled = false;
  selectedSeafarers: string = '';
  allSeafarersDropdown: any = [];  // sid link
  seafarersDropdown: any = []; 
  allSeafarersListDetails: any;

  constructor(
    private fb: FormBuilder, 
    private crewComplaintsService: CrewComplaintsService, 
    private messageService: MessageServiceService,
    private seafarerService: SeafarersServiceService
  ) {
        this.crewComplaintsForm = this.fb.group({
          sidNo: new FormControl(''),
          imoNo: new FormControl(''),
          vesselName: new FormControl(''),
          complaintorName: new FormControl(''),
          complaintDate: new FormControl(''),
          complaintType : new FormControl(''),
          complaint: new FormControl('')
        });
      }

      ngOnInit(): void{
      this.populateData();
      this.getSeafarersList();
    }

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
    });
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
        this.crewComplaintsService.getData().subscribe({
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
          console.log(this.crewComplaintsForm.value);
  
          if (this.mode === 'add'){
            this.crewComplaintsService.serviceCall(this.crewComplaintsForm.value).subscribe({
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
            this.crewComplaintsService.editData(this.selectedData?.id, this.crewComplaintsForm.value).subscribe ({
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
          this.crewComplaintsForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.crewComplaintsForm.reset();
        this.saveButtonLabel = 'Save';
        this.crewComplaintsForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.crewComplaintsForm.patchValue(data);
        this.saveButtonLabel = 'Edit';
        this.mode = 'edit';
        this.selectedData = data;
      }
  
      public deleteData(data: any): void {
        const id = data.id;
        
        try {
          this.crewComplaintsService.deleteData(id).subscribe ({
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

      onKey(eventTarget: any) {
    this.seafarersDropdown = this.search(eventTarget.value);
    }

    search(value: string) {
    let filter = value.toLowerCase();
    return this.allSeafarersDropdown.filter((option: any) => option.name.toLowerCase().startsWith(filter));
    }

    public onSeafarersSelect(event): void {
      let selectedSeafarersId = event;

    this.patchFormSeafarersValues(selectedSeafarersId);
    }

    public patchFormSeafarersValues(seafarersId: number): void {
      this.crewComplaintsForm.patchValue({
        sidNo: seafarersId
      });
    }

}
