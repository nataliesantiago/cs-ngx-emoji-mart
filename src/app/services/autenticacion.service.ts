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

  encPassword: String = 'Hola mundo'; //frase para encriptacion

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }
  /**
   * Metodo para autenticacion con google, donde de la informacion recuperada tomamos el token y 
   * lo encriptamos en aes 256 con la llave de encriptacion RSA
   */
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(data => {
        console.log('esta es la data de autenticacion', data);
        this.router.navigate(['']);
        sessionStorage.setItem('token', CryptoJS.AES.encrypt(data.authToken, this.encPassword.trim()));
      });
  }

  /**
   * Metodo de deslogeo para el usuario 
   */
  logout(): void {
    this.authService.signOut().then(data => {
      console.log('este es el desloggeo', data);
      sessionStorage.clear();
      sessionStorage.removeItem('token');
      this.router.navigate(['/blank']);
    });
  }

  async validStatus() {
    let loggeado;
    loggeado = await this.authService.authState.subscribe((user) => {
      if (user != null) {
        console.log('usuario loggueado', user);
      }
    });
    if (loggeado !== null) {
      return true;
    } else {
      return false;
    }
  }
}
