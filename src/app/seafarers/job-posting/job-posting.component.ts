import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { JobPostingServiceService } from 'src/app/services/seafarers/job-posting-service.service';

export interface PeriodicElement {
  jobDescription: String;
  jobPostingDate: Date;
}

const ELEMENT_DATA: any[] = [ 
  {jobDescription: 'ABCD', jobPostingDate: '25-04-2025'},
];

@Component({
  selector: 'app-job-posting',
  standalone: false,
  templateUrl: './job-posting.component.html',
  styleUrl: './job-posting.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPostingComponent {

  jobPostingForm : FormGroup;

  displayedColumns: string[] = ['jobDescription' ,'jobPostingDate', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  mode = 'add';
  isButtonDisabled = false;
  saveButtonLabel = 'Save';
  selectedData;
  selected: string;
  submitted: boolean;
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null;
  isFileSelected = false;


  constructor(private fb: FormBuilder, private seafarersService: JobPostingServiceService, private messageService: MessageServiceService, private sanitizer: DomSanitizer) {
        this.jobPostingForm = this.fb.group({
          jobPostImage: new FormControl(''),
          jobPostImageName: new FormControl(''),
          jobPostImageType: new FormControl(''),
          jobPost: new FormControl(''),
          jobPostingDate: new FormControl(''),
          jobDescription: new FormControl(''),
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

    public prepareSeafarerData(): FormData {
      const jobPostingFormData = new FormData();
      jobPostingFormData.append(
        'jobPostingForm',
        new Blob([JSON.stringify(this.jobPostingForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        jobPostingFormData.append(
          'jobPostImage',
          this.jobPostingForm.get('jobPostImage')?.value,
          this.jobPostingForm.get('jobPostImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.jobPostingForm.get('jobPostImage')?.value,
          this.jobPostingForm.get('jobPostImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.jobPostingForm.get('jobPostImageImageName')?.value,
          { type: this.jobPostingForm.get('jobPostImageImageType')?.value }
        );
        jobPostingFormData.append('jobPostImage', file, file.name);
      }
      return jobPostingFormData;
    }

    base64ToBlob(base64: string, mimeType: string): Blob {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    }

    onFileSelected(event: any): void {

      if (event.target.files) {
        const file = event.target.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(file)
        );
        this.previewUrl = url;
        this.isFileSelected = true;
        this.jobPostingForm.get('jobPostImage')?.setValue(file);
      }
    }

    onSubmit() {
      try {
        console.log('mode' + this.mode);
        console.log('Form Submitted');
        console.log(this.jobPostingForm.value);

        if (this.mode === 'add'){
          this.seafarersService.serviceCall(this.prepareSeafarerData()).subscribe({
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
          this.seafarersService.editData(this.selectedData?.id, this.prepareSeafarerData()).subscribe ({
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
        this.jobPostingForm.disable();
        this.isButtonDisabled = true;
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }

    public resetData(): void {
      this.jobPostingForm.reset();
      this.saveButtonLabel = 'Save';
      this.jobPostingForm.enable();
      this.isButtonDisabled = false;
    }

    public editData(data: any): void {
      this.jobPostingForm.patchValue(data);
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
