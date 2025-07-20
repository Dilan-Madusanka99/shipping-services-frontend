import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Payment } from '../models/payment.module';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private mockPayment: Payment[] = [
    {
      paymentNo: 'P001',
      itemNo: 'Rice',
      supplierName: 'Keells',
      quantity: 5,
      qtyMeasure: 'kg',
      amount: '1000',
      paymentDate: '2025-07-19',
      paymentStatus: 'paid'
    },
    {
      paymentNo: 'P002',
      itemNo: 'Juice',
      supplierName: 'Keells',
      quantity: 5,
      qtyMeasure: 'pcs',
      amount: '1000',
      paymentDate: '2025-07-15',
      paymentStatus: 'paid'
    },
    {
      paymentNo: 'P003',
      itemNo: 'Soap',
      supplierName: 'Keells',
      quantity: 5,
      qtyMeasure: 'pcs',
      amount: '1000',
      paymentDate: '2025-06-19',
      paymentStatus: 'paid'
    },
  ];

  paymentList:Payment[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/payment';

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

    getPayment(): Observable<any> {

    return new Observable<Payment[]>(observer => {
      observer.next(this.mockPayment);
      observer.complete();
    });
  }

}
