import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }
 
  autocompleteText(query:any) {
    const url_api = `http://localhost:8081/api/cliente/consultar/${query}`;
    return this.httpClient.get<any>(url_api);

  }



}
