import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { AjaxService } from '../../providers/ajax.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

  constructor(
    private ajax: AjaxService
  ) { }

  urlAutenticacion() {
    const url_api = `home/urlGsuite`;
    return this.ajax.get(url_api);
  }

  logOut() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
}
