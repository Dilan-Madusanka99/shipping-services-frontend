import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
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
      imoNo: '123456',
      vesselName: 'souselas',
      vesselType: 'bulk',
      flag: 'portugal',
      yob: '2007',
      grt: '14116',
      bhp: '2350kw',
    },
     {
      imoNo: '234567',
      vesselName: 'donjuan',
      vesselType: 'bulk',
      flag: 'portugal',
      yob: '2007',
      grt: '14116',
      bhp: '2350kw',
    },
      {
      imoNo: '345678',
      vesselName: 'narcea',
      vesselType: 'tanker',
      flag: 'portugal',
      yob: '2006',
      grt: '2995',
      bhp: '2350kw',
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
