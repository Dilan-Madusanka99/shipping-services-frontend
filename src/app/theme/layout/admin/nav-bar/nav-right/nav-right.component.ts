// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { AppNotification } from 'src/app/services/notification-service/notification.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';


@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit, OnDestroy {

  userName = '';
  panelOpen = false;
  subscribedAs = '';
  tick = 0;
  private tickerSub?: Subscription;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private cacheService: CacheService,
    public service: NotificationService
  ) {}
  ngOnInit(): void {
    this.setUserName();
    this.service.init();
    this.tickerSub = interval(30000).subscribe(() => this.tick++);
    // this.service.connect();
    // this.sendToUser();

    // this.latestSub = this.service.latest$.subscribe(n => {
    //   this.toasts = [...this.toasts, n];
    //   setTimeout(() => {
    //     this.toasts = this.toasts.filter(t => t.id !== n.id);
    //   }, 4000);
    // });
  }

  ngOnDestroy(): void {
    this.tickerSub?.unsubscribe();
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

  public timeAgo(value?: Date | string | null): string {
    if (!value) {
      return '--';
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return '--';
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 0) return 'just now';
    if (seconds < 60) return `${seconds} sec ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

    const weeks = Math.floor(days / 7);
    if (days < 30) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;

    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}
