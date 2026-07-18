// angular import
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { AppNotification } from 'src/app/services/notification-service/notification.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {

  userName = '';
  panelOpen = false;
  subscribedAs = '';

  constructor(
    private httpService: HttpService,
    private router: Router,
    private cacheService: CacheService,
    public service: NotificationService
  ) {}
  ngOnInit(): void {
    this.setUserName();
    // this.service.connect();
    // this.sendToUser();

    // this.latestSub = this.service.latest$.subscribe(n => {
    //   this.toasts = [...this.toasts, n];
    //   setTimeout(() => {
    //     this.toasts = this.toasts.filter(t => t.id !== n.id);
    //   }, 4000);
    // });
  }

  public setUserName(): void {
    this.userName = this.httpService.getLoginNameFromCache();
  }

  public logOutUser(): void {
    this.service.disconnect();
    this.cacheService.clear(this.httpService.getUserId()!);
    this.httpService.removeToken();
    this.router.navigate(['/auth/signin']);
  }

  public togglePanel(): void {
    this.panelOpen = !this.panelOpen;
    if (this.panelOpen) {
      this.service.markAllRead();
    }
  }

  public sendToUser(): void {
    const name = this.userName;
    const id =  this.httpService.getUserId();
    const notification: AppNotification  = {
      id: '',
      message: 'User Logged in Successfully!',
      type: 'LOGGIN',
      timeStamp: new Date(),
      readStatus: false,
      targetUser: id? +id : null,
      other: '',
      email: '',
      mobile: '',
      title: 'Loggin Notification'
    };

    setTimeout(() => {
      this.service.sendToUser(notification, name).subscribe((response: any) => {
      console.log(response);
    });
    }, 5000);
    
  }

  public trackById(index: number, item: AppNotification): string {
    return item.id || index.toString();
  }
}
