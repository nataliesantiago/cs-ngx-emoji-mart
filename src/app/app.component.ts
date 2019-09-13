import { Component, ViewChild, Input } from '@angular/core';
import { AutenticationService } from './services/autenticacion.service';
import { ResponseSearch } from './models/response-search';
import { User } from '../schemas/user.schema';
import { UserService } from './providers/user.service';


import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User;
  version = '0.0.12'
  constructor(public responseSearch: ResponseSearch, private userService: UserService) {
    this.responseSearch.setActive(true);
    moment.locale('es');
    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      if (this.user) {
        this.init();
      }
    });

  }

  init() {
    // ACA EMPIEZA SI EL USUARIO ES EXPERTO
    console.log('Versión: ', this.version);
    if (this.user.getIdRol() == 2) {
      this.userService.getFilasExperto();
    }
  }
}
