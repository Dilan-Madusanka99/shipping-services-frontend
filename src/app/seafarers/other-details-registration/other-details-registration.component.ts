import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';

export interface PeriodicElement {
  sidNo: String;
  ppNo: string;
  cdcNo: string;
  yellowFeverNo: string;
}

const ELEMENT_DATA: any[] = [ 
  {sidno: '123', ppNo: 'N123', cdcNo: 'C123', yellowFeverNo: 'AB123'},
];

@Component({
  selector: 'app-other-details-registration',
  standalone: false,
  templateUrl: './other-details-registration.component.html',
  styleUrl: './other-details-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherDetailsRegistrationComponent {

  otherDetailsRegistrationForm: FormGroup;

  displayedColumns: string[] = ['sidNo' ,'ppNo', 'cdcNo', 'yellowFeverNo', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: string;
  isButtonDisabled = false;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  

  constructor(private fb: FormBuilder, private seafarersService: SeafarersServiceService, private messageService: MessageServiceService) {
    this.otherDetailsRegistrationForm = this.fb.group({
      sidNo: new FormControl(''),
      sidIssuedPlace: new FormControl(''),
      sidIssuedDate: new FormControl(''),
      sidExpireDate: new FormControl(''),
      ppNo: new FormControl(''),
      ppIssuedPlace: new FormControl(''),
      ppIssuedDate: new FormControl(''),
      ppExpireDate: new FormControl(''),
      cdcNo: new FormControl(''),
      cdcIssuedPlace: new FormControl(''),
      cdcIssuedDate: new FormControl(''),
      cdcExpireDate: new FormControl(''),
      yellowFeverNo: new FormControl(''),
      yellowFeverIssuedPlace: new FormControl(''), 
      yellowFeverIssuedDate: new FormControl(''),
      yellowFeverExpireDate: new FormControl('')
    });

  }

  // get filteredItems() {
  //   return this.items.filter(item =>
  //     item.toLowerCase().includes(this.searchText.toLowerCase())
  //   );
  // }

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
          this.seafarersService.getData(). subscribe({
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
            console.log(this.otherDetailsRegistrationForm.value);
    
            if (this.mode === 'add'){
              this.seafarersService.serviceCall(this.otherDetailsRegistrationForm.value).subscribe({
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
              this.seafarersService.editData(this.selectedData?.id, this.otherDetailsRegistrationForm.value).subscribe ({
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
            this.otherDetailsRegistrationForm.disable();
            this.isButtonDisabled = true;
          } catch (error) {
            console.log(error);
            this.messageService.showError('Action Failed With Error' + error);
          }
        }
    
        public resetData(): void {
          this.otherDetailsRegistrationForm.reset();
          this.saveButtonLabel = 'Save';
          this.otherDetailsRegistrationForm.enable();
          this.isButtonDisabled = false;
        }
    
        public editData(data: any): void {
          this.otherDetailsRegistrationForm.patchValue(data);
          this.saveButtonLabel = 'Edit';
          this.mode = 'edit';
          this.selectedData = data;
        }
    
        public deleteData(data: any): void {
          const id = data.id;
          
          try {
            this.seafarersService.deleteData(id).subscribe ({
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
