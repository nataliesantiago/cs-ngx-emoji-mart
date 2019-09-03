import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor(private httpClient: HttpClient) { }

  searchFile(file: any) {
    const url_api = `${environment.URL_BACK}home/vision`;
    let arreglo = {
      id: 1,
      file: file
    }
    //return this.httpClient.post<any>(url_api, file);
  }
}
