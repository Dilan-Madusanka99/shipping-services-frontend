import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeafarersServiceService } from 'src/app/services/seafarers/seafarers.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';

export interface PeriodicElement {
  sidno: String;
  position: string;
  surname: string;
  mobile: string;
  availableDate: Date;
}

const ELEMENT_DATA: any[] = [ 
  {sidno: '100', position: 'AB', surname: 'Fernando', mobile: '076', availableDate: '07/04/2025'},
];

@Component({
  selector: 'app-seafarers-registration',
  standalone: false,
  templateUrl: './seafarers-registration.component.html',
  styleUrl: './seafarers-registration.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeafarersRegistrationComponent {

  seafarersForm : FormGroup;

  displayedColumns: string[] = ['sidNo' ,'position', 'surname', 'mobile', 'availableDate', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selected: string;
  isButtonDisabled = false;
  saveButtonLabel = 'Save';
  mode = 'add';
  selectedData;
  submitted: boolean;
  // Photo upload
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;


  constructor(private fb: FormBuilder, private seafarersService: SeafarersServiceService, private messageService: MessageServiceService) {
      this.seafarersForm = this.fb.group({
        img: new FormControl(''),
        sidNo: new FormControl('', [Validators.required]),
        position: new FormControl(''),
        appliedDate: new FormControl(''),
        availableDate: new FormControl(''),
        surname: new FormControl(''),
        otherNames: new FormControl(''),
        dob: new FormControl(''),
        birthPlace: new FormControl(''),
        nic: new FormControl(''),
        religion: new FormControl(''),
        marriedStatus: new FormControl(''),
        gender: new FormControl(''),
        noOfChildren: new FormControl(''),
        address: new FormControl(''),
        home: new FormControl(''),
        mobile: new FormControl(''),
        email: new FormControl(''),
        kinName: new FormControl(''),
        kinRelationship: new FormControl(''),
        kinAddress: new FormControl(''),
        kinMobile: new FormControl(''),
        kinEmail: new FormControl(''),
        englishLanguage: new FormControl(''),
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

    // Photo upload
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
  
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
  
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  
    onSubmit() {
        try {
          console.log('mode' + this.mode);
          console.log('Form Submitted');
          console.log(this.seafarersForm.value);
  
          if (this.mode === 'add'){
            this.seafarersService.serviceCall(this.seafarersForm.value).subscribe({
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
            this.seafarersService.editData(this.selectedData?.id, this.seafarersForm.value).subscribe ({
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
          this.seafarersForm.disable();
          this.isButtonDisabled = true;
        } catch (error) {
          console.log(error);
          this.messageService.showError('Action Failed With Error' + error);
        }
      }
  
      public resetData(): void {
        this.seafarersForm.reset();
        this.saveButtonLabel = 'Save';
        this.seafarersForm.enable();
        this.isButtonDisabled = false;
      }
  
      public editData(data: any): void {
        this.seafarersForm.patchValue(data);
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
