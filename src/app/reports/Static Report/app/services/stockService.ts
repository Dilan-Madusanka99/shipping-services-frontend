import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Employee } from '../models/employee.model';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Stock } from '../models/stock.model';


@Injectable({
  providedIn: 'root'
})
export class StockService {
  private mockStock: Stock[] = [
    {
      itemNo: 'I001',
      itemName: 'Soap',
      supplierName: 'Keells',
      quantity: 10,
      qtyMeasure: 'pcs'
    },
     {
      itemNo: 'I002',
      itemName: 'fish',
      supplierName: 'Fish City',
      quantity: 5,
      qtyMeasure: 'kg'
    },
      {
      itemNo: 'I003',
      itemName: 'Rice',
      supplierName: 'Keells',
      quantity: 10,
      qtyMeasure: 'kg'
    }
  ];

  stockList:Stock[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/stock';

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

    getStock(): Observable<any> {

    return new Observable<Stock[]>(observer => {
      observer.next(this.mockStock);
      observer.complete();
    });
  }

}
