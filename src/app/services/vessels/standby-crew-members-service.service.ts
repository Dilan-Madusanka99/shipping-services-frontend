import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class StandbyCrewMembersServiceService {

  constructor(private http: HttpClient, private httpService: HttpService) { }
    
      serviceCall(form_details: any) {
        console.log('In the Service');
    
        const requestUrl = environment.baseUrl + '/standbyCrewMembers';
        
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
        
        return this.http.post(requestUrl, form_details, {headers: headers});
      }
    
      getData() {
        const requestUrl = environment.baseUrl + '/standbyCrewMembers';
    
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
    
        const requestUrl = environment.baseUrl + '/standbyCrewMembers/' + id.toString();
        
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
    
        const requestUrl = environment.baseUrl + '/standbyCrewMembers/' + id.toString();
        
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
          headers = {
            Authorization: 'Bearer ' + this.httpService.getAuthToken(),
          };
        }
        
        return this.http.delete(requestUrl, {headers: headers});
      }
  
      private apiUrl = environment.baseUrl + '/standbyCrewMembers';
  
      getBySeafarerId(seafarerId: number): Observable<any> {
      return this.http.get(`${this.apiUrl}/seafarer/${seafarerId}`);
      }
  
      getSeafarerData(sidNo: String) {
        const requestUrl = environment.baseUrl + '/standbyCrewMembers/' + sidNo;
      
        let headers = {};
    
        if (this.httpService.getAuthToken() !== null) {
                headers = {
             Authorization: 'Bearer ' + this.httpService.getAuthToken()
          };
        }
      
         return this.http.get(requestUrl, headers);
       }
}
