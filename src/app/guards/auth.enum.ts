const checkUserAuthentication = (val: number) => {
  return 2;
};

export enum authenticationEnum {
  Super_Admin = 1,
  Home_Dashboard = 2,
  System_Privileges = 3,
  Privilege_Groups = 4,
  Employee_Details = 5,
  Employee_Attendence = 6,
  Vessle_Details = 7,
  Job_Vacancies = 8,
  Onboard_Crew_Details = 10,
  Standby_Crew_Members = 11,
  Crew_Complaints = 12,
  Personal_Details = 13,
  Document_Details = 14,
  Certificate_Details = 15,
  Sea_Services = 16,
  Certificate_Verification = 17,
  Appointment = 18,
  Item_Details = 19,
  Stocks = 20,
  Supplier_Details = 21,
  Payment_Details = 22,
  Login = 23,
  Employee_List = 24,
  Appointment_List = 25,
  Vessle_List = 26,
  Item_List = 27,
  Stock_List = 28,
  Supplier_List = 29,
  Payment_List = 30,
  Seafarer_Reistration_Chart = 31,
  Vessle_Registration_Chart = 32,
  Employee_Attendence_Chart = 33,
  Supplier_Payment_Chart = 34
}
