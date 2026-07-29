import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrivilegesService } from 'src/app/services/privileges/privileges.service';
import { PrivilegeGroupsAddEditComponent } from '../privilege-groups-add-edit/privilege-groups-add-edit.component';
import { AddRemoveTableComponent } from '../../add-remove-table/add-remove-table.component';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { authenticationEnum } from 'src/app/guards/auth.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privilege-groups',
  standalone: false,
  templateUrl: './privilege-groups.component.html',
  styleUrl: './privilege-groups.component.scss'
})
export class PrivilegeGroupsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'groupName', 'groupDescription', 'seafarerDefault', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  rightPanelStyle: any = {};
  selectedRecord: any;
  selectedRowIndex = -1;
  display = false;

  constructor(
    private _dialog: MatDialog,
    private _privilegesService: PrivilegesService, // private _empService: EmployeeService, // private _coreService: CoreService
    private _messageService: MessageServiceService,
    private _authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    try {
      this.checkAuthorization();
    } catch (error) {
      console.log(error);
    }
  }

  public checkAuthorization() {
    this.display = this._authService.checkAuthorization(authenticationEnum.Privilege_Groups);
    if (!this.display) {
      return;
    }
    this.getPrivilegeGroupList();
    this.closeContextMenu();
  }

  public setPrivilegesGroupList(groupListDetails: any[]) {
    try {
      if (groupListDetails.length <= 0) {
        return;
      }

      this.dataSource = new MatTableDataSource(groupListDetails);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.log(error);
      this.handleCatch();
    }
  }

  public openPrivilegeGroupAddEditClick(): void {
    try {
      const dialogRef = this._dialog.open(PrivilegeGroupsAddEditComponent);
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            if (val) {
              this.getPrivilegeGroupList();

              this._messageService.showSuccess('Privilege group added successfully!');
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
      this._messageService.showError('Action Failed!');
    }
  }

  public onEditPrivilageGroupClick(data: any): void {
    const dialogRef = this._dialog.open(PrivilegeGroupsAddEditComponent, {
      data
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this._messageService.showSuccess('Privilege group edited successfully!');
          this.getPrivilegeGroupList();
        }
      }
    });
  }

  public onDeletePrivilageGroupClick(id: number, data: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }

      this._privilegesService.deletePrivilegeGroup(id, data)
        .then(() => {
          this._messageService.showSuccess(
            'You have successfully deleted the privilege group!'
          );
          this.getPrivilegeGroupList();
        })
        .catch((error) => {
          console.log(error);
          this._messageService.showWarn(error);
        });

    });
  }

  public handleCatch(): void {
    this.dataSource = new MatTableDataSource([{}]);
    this.dataSource.sort = null;
    this.dataSource.paginator = null;
  }

  getPrivilegeGroupList() {
    try {
      this._privilegesService.getPrivilegeGroupList().then((response: any) => {
        this.setPrivilegesGroupList(response);
      });
    } catch (error) {
      console.log(error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  detectRightMouseClick($event: any, privilegeGroup: any) {
    this.selectedRowIndex = privilegeGroup.id;
    if ($event.which === 3) {
      this.rightPanelStyle = {
        display: 'block',
        position: 'absolute',
        'left.px': $event.clientX,
        'top.px': $event.clientY
      };
      this.selectedRecord = privilegeGroup;
    }
  }

  closeContextMenu() {
    this.rightPanelStyle = {
      display: 'none'
    };
  }
  onAddRemovePrivilegesClick() {
    try {
      const dialogRef = this._dialog.open(AddRemoveTableComponent, {
        height: '600px',
        width: '800px',
        data: {
          selectedItem: this.selectedRecord,
          assignedUrl: 'assigned-privileges',
          availableUrl: 'available-privileges',
          dataUrl: 'group-privileges'
        }
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getPrivilegeGroupList();
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  onAddRemoveUsersClick() {
    try {
      const dialogRef = this._dialog.open(AddRemoveTableComponent, {
        height: '600px',
        width: '800px',
        data: {
          selectedItem: this.selectedRecord,
          assignedUrl: 'group-assigned-users',
          availableUrl: 'group-available-users',
          dataUrl: 'privilege-group-users'
        }
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getPrivilegeGroupList();
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  onSetSeafarerDefault() {
    if (!this.selectedRecord?.id) {
      this._messageService.showError('No record selected');
      return;
    }

      Swal.fire({
        title: 'Set Seafarer Default?',
        text: 'Newly added Seafarers will use this group?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
      }).then((result) => {
          if (!result.isConfirmed) {
            return;
          }

          this._privilegesService.setDefaultSeafarerGroup(this.selectedRecord.id)
            .subscribe({
              next: () => {
                this._messageService.showSuccess(
                  'Set Default Seafarer Group Successfully!'
                );
                this.getPrivilegeGroupList();
              },
              error: (error: any) => {
                this._messageService.showError(error);
              }
            });
      });
  }
}
