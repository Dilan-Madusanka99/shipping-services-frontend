import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';
import { MessageServiceService } from 'src/app/services/message-service/message-service.service';
import { AppNotification } from 'src/app/services/notification-service/notification.model';
import { NotificationService } from 'src/app/services/notification-service/notification.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-auth-signin',
  standalone: false,
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export default class AuthSigninComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  userNamePasswordError = false;
  navState: any;

  data!: any[];
  private cacheSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService,
    private cacheService: CacheService,
    private _messageService: MessageServiceService,
    public service: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      loginName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    
    const navigation = this.router.getCurrentNavigation();
    this.navState = navigation?.extras.state as { data: any };
  }

  ngOnInit(): void {
    this.clearCacheIfNotAuthorize();

    this.cacheSubscription = this.cacheService.cache$.subscribe((data) => {
      this.data = data;
    });
    if (this.navState && this.navState.data && this.navState.data.action === 'SEND_REGISTER_NOTIFICATION') {
      if (this.navState.data.data) {
        /* send register notification */
        let msg = 'Welcome to V.W.SHIPPING!';
        let type = 'REGISTER';
        let title = 'REGISTER Notification';
        const name = this.navState.data.data;
        this.sendLoginNotificationToUser(msg, type, title, name);

        /* send complete details notification */
        msg = 'Please complete details registration! Navigate to Personal Details Page';
        type = 'DETAIL_REGISTER';
        title = 'Details Registration Notification';
        this.sendLoginNotificationToUser(msg, type, title, name);
      }
    }
  }

  public clearCacheIfNotAuthorize(): void {
    const isTokenExpired = this.httpService.isTokenExpired();
    if (isTokenExpired) {
      console.log('expired');
      this.httpService.clearCache();
    }
  }

  getData(userId: number): void {
    const cachedData = this.cacheService.get(userId.toString());

    // If the data is not in cache, we retrieve it from the server and store it in the cache.
    if (!cachedData) {
      this.httpService
        .getAuthIds(userId)
        .then((data: any) => {
          try {
            if (data.length > 0) {
              this.cacheService.set(userId.toString(), data);
              this.router.navigate(['/dashboard']);
            } else {
              this._messageService.showError('User does not have privileges, Please contact system administration');
            }
          } catch (error) {
            this._messageService.showError('Action Failed');
          }
        })
        .catch((error) => {
          this._messageService.showError('Action Failed');
        });
    }
  }

  get formControl() {
    return this.loginForm?.controls;
  }

  onSubmitLogin(): void {
    this.submitted = true;
    if (this.loginForm?.valid) {
      this.httpService
        .request('POST', '/login', {
          login: this.loginForm.value.loginName,
          password: this.loginForm.value.password
        })
        .then((response) => {
          this.httpService.setAuthToken(response.token);
          this.httpService.setUserId(response.id);
          // this.service.init();
          this.httpService.setLoginNameToCache(response.login);
          this.httpService.setUserRole(response.role);
          this.httpService.setUserSid(response.sid);
          
          this.service.connect()
          .pipe(
            filter(connected => connected),
            take(1)
          )
          .subscribe(() => {
            const msg = 'User Logged in Successfully!';
            const type = 'LOGGIN';
            const title = 'Loggin Notification';
            let name = this.httpService.getLoginNameFromCache();
            this.sendLoginNotificationToUser(msg, type, title, name);
          });

          this.getData(response.id);
        })
        .catch((error) => {
          this.userNamePasswordError = true;
          this._messageService.showError(error);
        });
    }
  }

  public sendLoginNotificationToUser(msg: string, type: string, title: string, name: string | null): void {
    const id =  this.httpService.getUserId();
    const notification: AppNotification  = {
      id: '',
      message: msg,
      type: type,
      timeStamp: new Date(),
      readStatus: false,
      targetUser: id? +id : null,
      other: '',
      email: '',
      mobile: '',
      title: title
    };

    this.service.sendToUser(notification, name).subscribe((response: any) => {
      console.log(response);
    });
  }
}
