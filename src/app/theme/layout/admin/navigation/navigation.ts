import { Injectable } from '@angular/core';
import { authenticationEnum } from 'src/app/guards/auth.enum';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
  auth?: number;
  isVisible: boolean;
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'home',
    title: 'Home',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    isVisible: false,
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        isVisible: true
      }
    ]
  },
  {
    id: 'privileges',
    title: 'Privileges Section',
    type: 'group',
    icon: 'icon-navigation',
    isVisible: false,
    auth: authenticationEnum.Privileges,
    children: [
      {
        id: 'privilegeDetails',
        title: 'Privileges',
        type: 'collapse',
        icon: 'ti ti-key',
        auth: authenticationEnum.Privileges,
        isVisible: false,
        children: [
          {
            id: 'systemPrivileges',
            title: 'System Privileges',
            type: 'item',
            url: '/privileges/system-privileges',
            icon: 'ti ti-dashboard',
            breadcrumbs: false,
            auth: authenticationEnum.System_Privileges,
            isVisible: false
          },
          {
            id: 'privilegeGroups',
            title: 'Privilege Grops',
            type: 'item',
            url: '/privileges/privilege-groups',
            icon: 'ti ti-dashboard',
            breadcrumbs: false,
            auth: authenticationEnum.Privilege_Groups,
            isVisible: false
          }
        ]
      }
    ]
  },

  {
    id: 'login',
    title: 'Login',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'LoginDet',
        title: 'Login',
        type: 'item',
        url: '/login/login',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'user',
    title: 'User',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'UserProfileDet',
        title: 'User Profile',
        type: 'item',
        url: '/user/userProfile',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },

  // {
  //   id: 'FormDemo',
  //   title: 'Form Demo',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   auth: authenticationEnum.Home,
  //   children: [
  //     {
  //       id: 'FormDemoDet',
  //       title: 'Form Demo',
  //       type: 'item',
  //       url: '/pages/form-demo',
  //       icon: 'feather icon-home',
  //       classes: 'nav-item',
  //       auth: authenticationEnum.Home_Dashboard,
  //       breadcrumbs: false
  //     }
  //   ]
  // },

  {
    id: 'registration',
    title: 'Employee',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'EmployeeDet',
        title: 'Employee Details',
        type: 'item',
        url: '/register/employee',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'EmployeeDet',
        title: 'Employee Attendence',
        type: 'item',
        url: '/register/employeeAttendence',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'vessels',
    title: 'vessels',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'VesselRegistrationDet',
        title: 'Vessel Details',
        type: 'item',
        url: '/vessels/vesselRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'VesselRegistrationDet',
        title: 'Job Vacancies',
        type: 'item',
        url: '/vessels/jobPosting',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'Onboard',
    title: 'Onboard Crew',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'OnboardDet',
        title: 'Onboard Crew Details',
        type: 'item',
        url: '/onboard/onboardCrewRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'OnboardDet',
        title: 'Crew Complaints',
        type: 'item',
        url: '/onboard/crewComplaints',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'Seafarers',
    title: 'Seafarers',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'SeafarersRegistrationDet',
        title: 'Personal Details',
        type: 'item',
        url: '/seafarers/seafarersRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Document Details',
        type: 'item',
        url: '/seafarers/otherDetailsRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Certificates Details',
        type: 'item',
        url: '/seafarers/certificatesRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Sea Services',
        type: 'item',
        url: '/seafarers/seaServices',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Certificates Verfication',
        type: 'item',
        url: '/seafarers/certificateVerification',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Appointment',
        type: 'item',
        url: '/seafarers/appointment',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Appointment List',
        type: 'item',
        url: '/seafarers/myAppointment',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'Inventory',
    title: 'Inventory & Supplier & Payment',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'InventoryDet',
        title: 'Items Details',
        type: 'item',
        url: '/inventory/itemsRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'InventoryDet',
        title: 'Stocks',
        type: 'item',
        url: '/inventory/stocks',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'InventoryDet',
        title: 'Supplier Details',
        type: 'item',
        url: '/inventory/supplierRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      },
      {
        id: 'InventoryDet',
        title: 'Payment Details',
        type: 'item',
        url: '/inventory/payments',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    type: 'group',
    icon: 'icon-navigation',
    auth: authenticationEnum.Home,
    children: [
      {
        id: 'employeeList',
        title: 'Employee List',
        type: 'item',
        url: '/reports/employee-list',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Home_Dashboard,
        breadcrumbs: false
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
