import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment } from 'src/environments/environment';
<<<<<<< HEAD
=======
import { Observable } from 'rxjs';
>>>>>>> 0b0e3fd272392c444c95cd634ca06d7825a2b1ba

@Injectable({
  providedIn: 'root'
})
export class OtherDetailsRegistrationService {

  constructor(private http: HttpClient, private httpService: HttpService) { }

  serviceCall(form_details: any) {
      console.log('In the Service');
  
      const requestUrl = environment.baseUrl + '/other_details_registration';
      
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
      
      return this.http.post(requestUrl, form_details, {headers: headers});
    }
  
    getData() {
      const requestUrl = environment.baseUrl + '/other_details_registration';
  
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
  
      return this.http.get(requestUrl, headers);
    }
  
    editData(id: number, form_details: any) {
      console.log('In edit data');
  
      const requestUrl = environment.baseUrl + '/other_details_registration/' + id.toString();
      
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
      
      return this.http.put(requestUrl, form_details, {headers: headers});
    }
  
    deleteData(id: number) {
      console.log('In delete data');
  
      const requestUrl = environment.baseUrl + '/other_details_registration/' + id.toString();
      
      let headers = {};
  
      if (this.httpService.getAuthToken() !== null) {
        headers = {
          Authorization: 'Bearer ' + this.httpService.getAuthToken(),
        };
      }
      
      return this.http.delete(requestUrl, {headers: headers});
    }
<<<<<<< HEAD
=======

    getBySeafarerId(seafarerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/seafarer/${seafarerId}`);
    }
>>>>>>> 0b0e3fd272392c444c95cd634ca06d7825a2b1ba
}
