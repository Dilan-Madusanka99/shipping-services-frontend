import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Appointment } from '../models/appointment.model';


@Injectable({
  providedIn: 'root'
})
export class AppointmentListService {
  private mockAppointment: Appointment[] = [
    {
      sidNo: 'S001',
      firstName: 'John',
      lastName: 'Perera',
      position: 'os',
      appointmentDate: '1998-01-15',
      appointmentTime: '10.00-10.30'
    },
     {
      sidNo: 'S002',
      firstName: 'John',
      lastName: 'Perera',
      position: 'os',
      appointmentDate: '1998-01-15',
      appointmentTime: '10.00-10.30'
    },
      {
      sidNo: 'S003',
      firstName: 'John',
      lastName: 'Perera',
      position: 'os',
      appointmentDate: '1998-01-15',
      appointmentTime: '10.00-10.30'
    }
  ];

  appointmentList:Appointment[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/appointment';

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


    getAppointment(): Observable<any> {

    return new Observable<Appointment[]>(observer => {
      observer.next(this.mockAppointment);
      observer.complete();
    });
  }

}
