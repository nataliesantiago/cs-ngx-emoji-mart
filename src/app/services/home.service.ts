import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  token = '';
  constructor(private httpClient: HttpClient) {
    
  }

  
  autocompleteText(query: any) {

    var base64 = window.btoa(query);
    const url_api = `${environment.URL_BACK}home/consultar/${base64}`;
    return this.httpClient.get<any>(url_api);
  }

  searchFile(file: any) {
    const url_api = `${environment.URL_BACK}home/vision`;
    let arreglo = {
      id: 1,
      file: file
    }
    return this.httpClient.post<any>(url_api, file);
  }

  guardarBusqueda(json: any) {
    const url_api = `${environment.URL_BACK}home/busquedaUsuarios/insert`;
    return this.httpClient.post<any>(url_api, json);
  }
}
