import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/app/environments/environment';
import { Item } from '../models/item.module';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private mockItem: Item[] = [
    {
      itemNo: 'I001',
      itemName: 'soap',
      itemCategory: 'food'
    },
     {
      itemNo: 'I002',
      itemName: 'brush',
      itemCategory: 'deck'
    },
      {
      itemNo: 'I003',
      itemName: 'nut',
      itemCategory: 'engine'
    }
  ];

  itemList:Item[] = [];

  constructor(
    private http: HttpClient,
    private httpService: HttpService
  ) { }

  private apiUrl = environment.baseUrl + '/item';

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

    getItem(): Observable<any> {

    return new Observable<Item[]>(observer => {
      observer.next(this.mockItem);
      observer.complete();
    });
  }

}
