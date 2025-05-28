import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) {}

  serviceCall(form_details: any) {
    console.log('In the Service');

    const requestUrl = environment.baseUrl + '/employee';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.post(requestUrl, form_details, { headers: headers });
  }

  getData() {
    const requestUrl = environment.baseUrl + '/employee';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.get(requestUrl, headers);
  }

  editData(id: number, form_details: any) {
    console.log('In edit data');

    const requestUrl = environment.baseUrl + '/employee/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.put(requestUrl, form_details, { headers: headers });
  }

  deleteData(id: number) {
    console.log('In delete data');

    const requestUrl = environment.baseUrl + '/employee/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }

    return this.http.delete(requestUrl, { headers: headers });
  }

  // getEmployeeList() {
  //   const requestUrl = environment.baseUrl + '/employee/get-employee-list';

  //   let headers = {};

  //   if (this.httpservice.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpservice.getAuthToken()
  //     };
  //   }

  //   return this.http.get(requestUrl, headers);
  // }
}
