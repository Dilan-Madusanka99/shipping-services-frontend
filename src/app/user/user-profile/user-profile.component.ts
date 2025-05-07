import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { UserProfileService } from 'src/app/services/userProfile/user-profile.service';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent { 

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

  userProfileForm: FormGroup;

  constructor(private fb: FormBuilder, private userProfileService: UserProfileService, private messageService: MessageServiceService, private sanitizer: DomSanitizer) {
          this.userProfileForm = this.fb.group({
            userProfileImage: new FormControl(''),
            userProfileImageName: new FormControl(''),
            userProfileImageType: new FormControl(''),
            firstName: new FormControl(''),
            lastName: new FormControl(''),
            email: new FormControl(''),
            phone: new FormControl(''),
            mobile: new FormControl(''),
            address: new FormControl(''),
          });
    }

    ngOnInit(): void{
      this.populateData();
    }

    public populateData(): void {
          try {
            this.userProfileService.getData(). subscribe({
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

    public prepareUserProfileData(): FormData {
      const userProfileFormData = new FormData();
      userProfileFormData.append(
        'userProfileForm',
        new Blob([JSON.stringify(this.userProfileForm.value)], {
          type: 'application/json',
        })
      );
  
      if (this.isFileSelected) {
        userProfileFormData.append(
          'userProfileImage',
          this.userProfileForm.get('userProfileImage')?.value,
          this.userProfileForm.get('userProfileImage')?.value.name
        );
      } else {
        const imageBlob = this.base64ToBlob(
          this.userProfileForm.get('userProfileImage')?.value,
          this.userProfileForm.get('userProfileImageImageType')?.value
        );
        const file = new File(
          [imageBlob],
          this.userProfileForm.get('userProfileImageImageName')?.value,
          { type: this.userProfileForm.get('userProfileImageImageType')?.value }
        );
        userProfileFormData.append('userProfileImage', file, file.name);
      }
      return userProfileFormData;
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
        this.userProfileForm.get('userProfileImage')?.setValue(file);
      }
    }

    onSubmit() {
      try {
        console.log('mode' + this.mode);
        console.log('Form Submitted');
        console.log(this.userProfileForm.value);

        if (this.mode === 'add'){
          this.userProfileService.serviceCall(this.prepareUserProfileData()).subscribe({
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
          this.userProfileService.editData(this.selectedData?.id, this.prepareUserProfileData()).subscribe ({
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
        this.userProfileForm.disable();
        this.isButtonDisabled = true;
      } catch (error) {
        console.log(error);
        this.messageService.showError('Action Failed With Error' + error);
      }
    }

    public resetData(): void {
      this.userProfileForm.reset();
      this.saveButtonLabel = 'Save';
      this.userProfileForm.enable();
      this.isButtonDisabled = false;
    }

    public editData(data: any): void {
      this.userProfileForm.patchValue(data);
      this.saveButtonLabel = 'Edit';
      this.mode = 'edit';
      this.selectedData = data;
    }

    public deleteData(data: any): void {
      const id = data.id;
      
      try {
        this.userProfileService.deleteData(id).subscribe ({
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
