// angular import
import { Component, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { NavigationItem } from '../navigation';
import { environment } from 'src/environments/environment';
import { CacheService } from 'src/app/services/CacheService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent {
  // public props
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;
  @Output() onNavCollapsedMob = new EventEmitter();
  private cacheSubscription!: Subscription;
  data!: number[];
  navigation: any;
  windowWidth: number;

  // constructor
  constructor(
    public nav: NavigationItem,
    private location: Location,
    private cacheService: CacheService
  ) {
    this.windowWidth = window.innerWidth;
    this.navigation = this.nav.get();
    this.cacheSubscription = this.cacheService.cache$.subscribe((data) => {
      this.data = data;

      this.setAuthStatusInNavItems(this.data);
    });
  }

  public setEntitlements(navigationArray: NavigationItem[], isAdmin: boolean, privilegeArray?: number[]): void {
    navigationArray.forEach((element) => {
      if (isAdmin) {
        element.isVisible = true;
      } else if (privilegeArray.includes(element.auth)) {
        element.isVisible = true;
      } else {
        element.isVisible = false;
      }

      if (element.children && element.children.length > 0) {
        this.setEntitlements(element.children, isAdmin, privilegeArray);
      }

      if (!element.children || element.children.length === 0) {
        if (isAdmin) {
          element.isVisible = true;
          return;
        } else {
          if (privilegeArray.includes(element.auth)) {
            element.isVisible = true;
          } else {
            element.isVisible = false;
          }
        }

        if (privilegeArray && privilegeArray.length === 0) {
          element.isVisible = false;
        }
        return;
      }
    });
  }

  public setAuthStatusInNavItems(authId: number[]) {
    this.navigation = this.nav.get();
    let isAdmin = false;
    if (authId && authId.length > 0) {
      if (authId.includes(1)) {
        isAdmin = true;
        this.setEntitlements(this.navigation, isAdmin);
        return;
      }

      this.setEntitlements(this.navigation, isAdmin, authId);
    } else if (JSON.parse(window.localStorage.getItem('privileges')!)?.length! > 0) {
      const privilegeArray = JSON.parse(window.localStorage.getItem('privileges')!);
      if (privilegeArray.includes(1)) {
        isAdmin = true;
        this.setEntitlements(this.navigation, isAdmin, privilegeArray);
        return;
      }
      isAdmin = false;
      this.setEntitlements(this.navigation, isAdmin, privilegeArray);
    } else if (authId && authId.length === 0) {
      isAdmin = false;
      this.setEntitlements(this.navigation, isAdmin, authId);
    }

    console.log(this.navigation);
  }

  // public method
  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar').classList.contains('mob-open')) {
      this.onNavCollapsedMob.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
