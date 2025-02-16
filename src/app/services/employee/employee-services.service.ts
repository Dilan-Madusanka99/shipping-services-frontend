import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServicesService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(form_details: any) {
    console.log("In the Service");

    const requestUrl = environment.baseUrl + '/employee';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.post (requestUrl, form_details, headers);
  }
}
