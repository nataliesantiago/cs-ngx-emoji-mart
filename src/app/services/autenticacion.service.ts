import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  urlAutenticacion() {
    const url_api = `${environment.URL_BACK}home/urlGsuite`;
    return this.httpClient.get<any>(url_api);
  }
}
