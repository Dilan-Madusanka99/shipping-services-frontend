// angular import
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/services/CacheService';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit{

  userName = '';

  constructor(
    private httpService: HttpService,
    private router: Router,
    private cacheService: CacheService
  ) {}
  ngOnInit(): void {
    this.setUserName();
  }

  public setUserName(): void {
    this.userName = this.httpService.getLoginNameFromCache();
  }

  public logOutUser(): void {
    this.cacheService.clear(this.httpService.getUserId()!);
    this.httpService.removeToken();
    this.router.navigate(['/auth/signin']);
  }
}
