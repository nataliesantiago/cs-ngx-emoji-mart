import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }
 
  autocompleteText(query:any) {
  
    var base64 = window.btoa(query);
    const url_api = `//localhost:8080/api/home/consultar/${base64}`;
    return this.httpClient.get<any>(url_api);

  }
  searchFile(file: any) {
    const url_api = `http://localhost:8080/api/home/vision`;
    let arreglo = {
      id : 1,
      file: file
    } 
    return this.httpClient.post<any>(url_api, file);

  }



}
