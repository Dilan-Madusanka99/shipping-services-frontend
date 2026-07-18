import { Injectable, NgZone } from "@angular/core";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { AppNotification } from "./notification.model";
import { environment } from "src/app/environments/environment";
import { HttpService } from "../http.service";
import { HttpClient } from "@angular/common/http";


@Injectable({ providedIn: 'root' })
export class NotificationService {
  private client: Client | null = null;
  private userSubscription: StompSubscription | null = null;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  private latestSubject = new Subject<AppNotification>();
  readonly connected$: Observable<boolean> = this.connectedSubject.asObservable();
  readonly notifications$: Observable<AppNotification[]> = this.notificationsSubject.asObservable();
  readonly unreadCount$: Observable<number> = this.notifications$.pipe(
    map(list => list.filter(n => !n.readStatus).length)
  );
  readonly latest$: Observable<AppNotification> = this.latestSubject.asObservable();

  constructor(private zone: NgZone, private http: HttpClient, private httpService: HttpService) {}

  init(): void {
    this.loadHistory();
  }

    /** First page of saved notifications (newest first). */
  loadHistory() {
    const requestUrl = environment.baseUrl + '/notification/' + this.httpService.getUserId();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = { Authorization: 'Bearer ' + this.httpService.getAuthToken() };
    }

    this.http.get(requestUrl, { headers: headers }).subscribe((res: any) => {
      this.notificationsSubject.next(res);
    });
  }

  connect(): Observable<boolean> {
    if (this.client && this.client.active) {
      return this.connected$;;
    }

    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg: string) => console.debug('[STOMP]', msg)
    });

    this.client.onConnect = () => {
      this.zone.run(() => this.connectedSubject.next(true));

      if (this.client) {
        this.client.subscribe('/topic/notifications',
          (message: IMessage) => this.handleIncoming(message));

        const username = this.httpService.getLoginNameFromCache();

        this.client!.subscribe(
        '/topic/user.' + username,
        msg => this.handleIncoming(msg)
      );
    }
  };

    this.client.onWebSocketClose = () => {
      this.zone.run(() => this.connectedSubject.next(false));
    };

    this.client.activate();
    return this.connected$;
  }

  subscribeToUser(username: string): void {
    if (!this.client || !this.client.connected) {
      return;
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.userSubscription = this.client.subscribe(
      '/topic/user.' + username,
      (message: IMessage) => this.handleIncoming(message)
    );
  }

  markAllRead(): void {
    const updated = this.notificationsSubject.value.map(n => ({ ...n, readStatus: true }));
    this.notificationsSubject.next(updated);
    /* send backend request to mark all notification as readed */
  }

  clear(): void {
    this.notificationsSubject.next([]);
    /* send backend request to not to show all notification */
  }

  disconnect(): void {
    console.log(
      'Before clear',
      this.notificationsSubject.value
    );
    if (this.userSubscription) {
        this.userSubscription.unsubscribe();
        this.userSubscription = null;
    }
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.notificationsSubject.next([]);
    this.connectedSubject.next(false);
    console.log(
      'After clear',
      this.notificationsSubject.value
    );
  }

  private handleIncoming(message: IMessage): void {
    const notification: AppNotification = JSON.parse(message.body);
    this.zone.run(() => {
      const list = [notification, ...this.notificationsSubject.value].slice(0, 50);
      this.notificationsSubject.next(list);
      this.latestSubject.next(notification);
    });
  }

  public sendToUser(notification: AppNotification, userName: string | null) {
    const requestUrl = environment.baseUrl + '/notification/user/' + userName;
    let headers = {};
    if (this.httpService.getAuthToken() !== null) {
        headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
    }
    return this.http.post(requestUrl, notification, {headers: headers});
  }
}