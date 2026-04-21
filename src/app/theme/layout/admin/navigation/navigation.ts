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
  auth?: number[];
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
    auth: [authenticationEnum.Home_Dashboard],
    isVisible: false,
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-grid',
        classes: 'nav-item',
        auth: [authenticationEnum.Home_Dashboard],
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
    auth: [authenticationEnum.System_Privileges, authenticationEnum.Privilege_Groups],
    children: [
      {
        id: 'privilegeDetails',
        title: 'Privileges',
        type: 'collapse',
        icon: 'feather icon-user-check',
        auth: [authenticationEnum.System_Privileges, authenticationEnum.Privilege_Groups],
        isVisible: false,
        children: [
          {
            id: 'systemPrivileges',
            title: 'System Privileges',
            type: 'item',
            url: '/privileges/system-privileges',
            icon: 'ti ti-dashboard',
            breadcrumbs: false,
            auth: [authenticationEnum.System_Privileges],
            isVisible: false
          },
          {
            id: 'privilegeGroups',
            title: 'Privilege Grops',
            type: 'item',
            url: '/privileges/privilege-groups',
            icon: 'ti ti-dashboard',
            breadcrumbs: false,
            auth: [authenticationEnum.Privilege_Groups],
            isVisible: false
          }
        ]
      }
    ]
  },

  {
    id: 'registration',
    title: 'Employee',
    type: 'group',
    icon: 'icon-navigation',
    auth: [authenticationEnum.Employee_Details, authenticationEnum.Employee_Attendence],
    children: [
      {
        id: 'EmployeeDet',
        title: 'Employee Details',
        type: 'item',
        url: '/register/employee',
        icon: 'feather icon-user',
        classes: 'nav-item',
        auth: authenticationEnum.Employee_Details,
        breadcrumbs: false
      },
      {
        id: 'EmployeeDet',
        title: 'Employee Attendence',
        type: 'item',
        url: '/register/employeeAttendence',
        icon: 'feather icon-calendar',
        classes: 'nav-item',
        auth: authenticationEnum.Employee_Attendence,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'vessels',
    title: 'vessels',
    type: 'group',
    icon: 'icon-navigation',
    auth: [authenticationEnum.Vessle_Details, authenticationEnum.Job_Vacancies],
    children: [
      {
        id: 'VesselRegistrationDet',
        title: 'Vessel Details',
        type: 'item',
        url: '/vessels/vesselRegistration',
        icon: 'feather icon-anchor',
        classes: 'nav-item',
        auth: [authenticationEnum.Vessle_Details],
        breadcrumbs: false
      },
      
      {
        id: 'VesselRegistrationDet',
        title: 'Job Vacancies',
        type: 'item',
        url: '/vessels/jobPosting',
        icon: 'feather icon-briefcase',
        classes: 'nav-item',
        auth: [authenticationEnum.Job_Vacancies],
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'Seafarers',
    title: 'Seafarers',
    type: 'group',
    icon: 'icon-navigation',
    auth: [
      authenticationEnum.Personal_Details,
      authenticationEnum.Document_Details,
      authenticationEnum.Certificate_Details,
      authenticationEnum.Sea_Services,
      authenticationEnum.Certificate_Verification,
      authenticationEnum.Appointment
    ],
    children: [
      {
        id: 'SeafarersRegistrationDet',
        title: 'Appointment',
        type: 'item',
        url: '/seafarers/appointment',
        icon: 'feather icon-calendar',
        classes: 'nav-item',
        auth: [authenticationEnum.Appointment],
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Personal Details',
        type: 'item',
        url: '/seafarers/seafarersRegistration',
        icon: 'feather icon-user',
        classes: 'nav-item',
        auth: [authenticationEnum.Personal_Details],
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Document Details',
        type: 'item',
        url: '/seafarers/otherDetailsRegistration',
        icon: 'feather icon-file',
        classes: 'nav-item',
        auth: [authenticationEnum.Document_Details],
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Certificates Details',
        type: 'item',
        url: '/seafarers/certificatesRegistration',
        icon: 'feather icon-award',
        classes: 'nav-item',
        auth: [authenticationEnum.Certificate_Details],
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Sea Services',
        type: 'item',
        url: '/seafarers/seaServices',
        icon: 'feather icon-anchor',
        classes: 'nav-item',
        auth: [authenticationEnum.Sea_Services],
        breadcrumbs: false
      },
      {
        id: 'SeafarersRegistrationDet',
        title: 'Certificates Verfication',
        type: 'item',
        url: '/seafarers/certificateVerification',
        icon: 'feather icon-check-circle',
        classes: 'nav-item',
        auth: [authenticationEnum.Certificate_Verification],
        breadcrumbs: false
      },
      {
        id: 'seafarerDoc',
        title: 'Seafarer Document',
        type: 'item',
        url: '/seafarers/seafarerDoc',
        icon: 'feather icon-check-circle',
        classes: 'nav-item',
        auth: [authenticationEnum.Personal_Details],
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'Onboard',
    title: 'Onboard Crew',
    type: 'group',
    icon: 'icon-navigation',
    auth: [authenticationEnum.Certificate_Details, authenticationEnum.Crew_Complaints, authenticationEnum.Standby_Crew_Members],
    children: [
      {
        id: 'OnboardDet',
        title: 'Onboard Crew Details',
        type: 'item',
        url: '/onboard/onboardCrewRegistration',
        icon: 'feather icon-home',
        classes: 'nav-item',
        auth: authenticationEnum.Certificate_Details,
        breadcrumbs: false
      },
      {
        id: 'OnboardDet',
        title: 'Standby Crew Details',
        type: 'item',
        url: '/vessels/standbyCrewMembers',
        icon: 'feather icon-briefcase',
        classes: 'nav-item',
        auth: [authenticationEnum.Standby_Crew_Members],
        breadcrumbs: false
      },
      {
        id: 'OnboardDet',
        title: 'Crew Complaints',
        type: 'item',
        url: '/onboard/crewComplaints',
        icon: 'feather icon-alert-circle',
        classes: 'nav-item',
        auth: authenticationEnum.Crew_Complaints,
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'Inventory',
    title: 'Inventory & Supplier & Payment',
    type: 'group',
    icon: 'icon-navigation',
    auth: [
      authenticationEnum.Item_Details,
      authenticationEnum.Stocks,
      authenticationEnum.Supplier_Details,
      authenticationEnum.Payment_Details
    ],
    children: [
      {
        id: 'InventoryDet',
        title: 'Items Details',
        type: 'item',
        url: '/inventory/itemsRegistration',
        icon: 'feather icon-package',
        classes: 'nav-item',
        auth: [authenticationEnum.Item_Details],
        breadcrumbs: false
      },
      {
        id: 'InventoryDet',
        title: 'Stocks',
        type: 'item',
        url: '/inventory/stocks',
        icon: 'feather icon-box',
        classes: 'nav-item',
        auth: [authenticationEnum.Stocks],
        breadcrumbs: false
      },
      {
        id: 'InventoryDet',
        title: 'Supplier Details',
        type: 'item',
        url: '/inventory/supplierRegistration',
        icon: 'feather icon-user-plus',
        classes: 'nav-item',
        auth: [authenticationEnum.Supplier_Details],
        breadcrumbs: false
      },
      {
        id: 'InventoryDet',
        title: 'Payment Details',
        type: 'item',
        url: '/inventory/payments',
        icon: 'feather icon-credit-card',
        classes: 'nav-item',
        auth: [authenticationEnum.Payment_Details],
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'login',
    title: 'Login',
    type: 'group',
    icon: 'icon-navigation',
    auth: [authenticationEnum.Login],
    children: [
      {
        id: 'LoginDet',
        title: 'Login',
        type: 'item',
        url: '/login/login',
        icon: 'feather icon-log-in',
        classes: 'nav-item',
        auth: [authenticationEnum.Login],
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    type: 'group',
    icon: 'icon-navigation',
    auth: [
      authenticationEnum.Employee_List,
      authenticationEnum.Appointment_List,
      authenticationEnum.Vessle_List,
      authenticationEnum.Item_List,
      authenticationEnum.Stock_List,
      authenticationEnum.Supplier_List,
      authenticationEnum.Payment_List
    ],
    children: [
      {
        id: 'employeeList',
        title: 'Employee List',
        type: 'item',
        url: '/reports/employee-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Employee_List],
        breadcrumbs: false
      },
      {
        id: 'appointmentList',
        title: 'Appointment List',
        type: 'item',
        url: '/reports/appointment-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Appointment_List],
        breadcrumbs: false
      },
      {
        id: 'vesselList',
        title: 'Vessel List',
        type: 'item',
        url: '/reports/vessel-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Vessle_List],
        breadcrumbs: false
      },
      {
        id: 'itemList',
        title: 'Item List',
        type: 'item',
        url: '/reports/item-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Item_List],
        breadcrumbs: false
      },
      {
        id: 'stockList',
        title: 'Stock List',
        type: 'item',
        url: '/reports/stock-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Stock_List],
        breadcrumbs: false
      },
      {
        id: 'supplierList',
        title: 'Supplier List',
        type: 'item',
        url: '/reports/supplier-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Supplier_List],
        breadcrumbs: false
      },
      {
        id: 'paymentList',
        title: 'Payment List',
        type: 'item',
        url: '/reports/payment-list',
        icon: 'icon-clipboard',
        classes: 'nav-item',
        auth: [authenticationEnum.Payment_List],
        breadcrumbs: false
      }
    ]
  },

  {
    id: 'charts',
    title: 'Charts',
    type: 'group',
    icon: 'icon-navigation',
    auth: [
      authenticationEnum.Seafarer_Reistration_Chart,
      authenticationEnum.Vessle_Registration_Chart,
      // authenticationEnum.Employee_Attendence_Chart,
      authenticationEnum.Supplier_Payment_Chart
    ],
    children: [
      {
        id: 'seafarersMontlyRegistrationChart',
        title: 'Seafarer Registration',
        type: 'item',
        url: '/charts/seafarersRegisteredByMonthly',
        icon: 'feather icon-bar-chart',
        classes: 'nav-item',
        auth: [authenticationEnum.Seafarer_Reistration_Chart],
        breadcrumbs: false
      },
      {
        id: 'vesselRegisteredByTypeChart',
        title: 'Vessel Registration',
        type: 'item',
        url: '/charts/vesselRegisteredByType',
        icon: 'feather icon-bar-chart',
        classes: 'nav-item',
        auth: [authenticationEnum.Vessle_Registration_Chart],
        breadcrumbs: false
      },
      // {
      //   id: 'employeeAttendenceMonthChart',
      //   title: 'Employee Attendance',
      //   type: 'item',
      //   url: '/charts/employeeAttendanceByMonth',
      //   icon: 'feather icon-bar-chart',
      //   classes: 'nav-item',
      //   auth: [authenticationEnum.Employee_Attendence_Chart],
      //   breadcrumbs: false
      // },
      {
        id: 'paymentsMonthChart',
        title: 'Supplier Payments',
        type: 'item',
        url: '/charts/paymentSByMonthly',
        icon: 'feather icon-bar-chart',
        classes: 'nav-item',
        auth: [authenticationEnum.Supplier_Payment_Chart],
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
