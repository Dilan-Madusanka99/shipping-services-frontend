import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Supplier } from '../models/supplier.module';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private mockSupplier: Supplier[] = [
    {
      supplierNo: 'S001',
      supplierName: 'John',
      supplierCategory: 'food',
      supplierContactNo: '0768470851'
    },
     {
      supplierNo: 'S002',
      supplierName: 'Johnny',
      supplierCategory: 'deck',
      supplierContactNo: '0758058762'
    },
      {
      supplierNo: 'S003',
      supplierName: 'Joss',
      supplierCategory: 'engine',
      supplierContactNo: '0728574963'
    }
  ];

  supplierList:Supplier[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/supplier';

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

    getSupplier(): Observable<any> {

    return new Observable<Supplier[]>(observer => {
      observer.next(this.mockSupplier);
      observer.complete();
    });
  }

}
