import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Vessel } from '../models/vessel.model';


@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private mockVessel: Vessel[] = [
    {
      imoNo: "9455265",
      vesselName: "MV DonJuan",
      vesselType: "Bulk",
      flag: "Portugal",
      yob: "2007",
      grt: "6584",
      bhp: "512",
    },
    {
      imoNo: "9455264",
      vesselName: "MV Souselas",
      vesselType: "Bulk",
      flag: "Portugal",
      yob: "2007",
      grt: "6584",
      bhp: "512",
    },
    {
      imoNo: "9455267",
      vesselName: "MT Narcea",
      vesselType: "Tanker",
      flag: "Portugal",
      yob: "2007",
      grt: "6584",
      bhp: "512",
    }     
  ];

  vesselList:Vessel[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/vessel';

    private getHeaders() {
    let headers = {};
    const authToken = this.httpService.getAuthToken();
    if (authToken !== null) {
      headers = {
        Authorization: 'Bearer ' + authToken,
      };
    }
    return headers;
  }

    getVessel(): Observable<any> {

    return new Observable<Vessel[]>(observer => {
      observer.next(this.mockVessel);
      observer.complete();
    });
  }

}
