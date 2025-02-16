import { Injectable } from '@angular/core';
import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormDemoServiceService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(form_details: any) {
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/form-demo';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.post(requestUrl, form_details, headers);
  }  

  getData() {
    const requestUrl = environment.baseUrl + '/form-demo';

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.get(requestUrl, headers);
  }

  editData(id: number, form_details: any) {
    console.log('In Edit');

    const requestUrl = environment.baseUrl + '/form-demo/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.put(requestUrl, form_details, { headers: headers});
  }

  deleteData(id: number) {
    console.log('In Delete Data');

    const requestUrl = environment.baseUrl + '/form-demo/' + id.toString();

    let headers = {};

    if (this.httpService.getAuthToken() !== null) {
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken()
      };
    }
    return this.http.delete(requestUrl, { headers: headers});
  }
}


