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
  Standby_Crew_Members = 33,
  Job_Vacancies = 8,
  Onboard_Crew_Details = 10,
  Crew_Complaints = 11,
  Personal_Details = 12,
  Document_Details = 13,
  Certificate_Details = 14,
  Sea_Services = 15,
  Certificate_Verification = 16,
  Appointment = 17,
  Item_Details = 18,
  Stocks = 19,
  Supplier_Details = 20,
  Payment_Details = 21,
  Login = 22,
  Employee_List = 23,
  Appointment_List = 24,
  Vessle_List = 25,
  Item_List = 26,
  Stock_List = 27,
  Supplier_List = 28,
  Payment_List = 29,
  Seafarer_Reistration_Chart = 30,
  Vessle_Registration_Chart = 31,
  Employee_Attendence_Chart = 32,
  Supplier_Payment_Chart = 33
}
