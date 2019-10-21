import { Component, ViewChild, Input, Inject } from '@angular/core';
import { AutenticationService } from './services/autenticacion.service';
import { ResponseSearch } from './models/response-search';
import { User } from '../schemas/user.schema';
import { UserService } from './providers/user.service';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/platform-browser';
import { LookFeelService } from './providers/look-feel.service';

import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { AjaxService } from './providers/ajax.service';
import { SearchService } from './providers/search.service';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user: User;
  version = '0.0.25'
  constructor(public responseSearch: ResponseSearch, private userService: UserService, private ajax: AjaxService, private searchService: SearchService,
    @Inject(DOCUMENT) private _document: HTMLDocument, private look_service: LookFeelService) {
    this.responseSearch.setActive(true);
    moment.locale('es');
    this.ajax.sethost(environment.URL_BACK);
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
    /*this.searchService.queryCloudSearch().then(d => {
      console.log('it worked');
    })*/
    this.initFavicon();
    this.getDarkMode();
  }

  /**
   * Funcion para obtener la url del favicon y asignarla a la etiqueta correspondiente
   */
  initFavicon() {
    this.look_service.getSpecificSetting('url_favicon').then((result) => {
      if (result && result[0] && result[0].valor) {
        this._document.getElementById('conecta_favicon').setAttribute('href', result[0].valor);
      }

    });
  }

  /**
   * Funcion para obtener si el usuario tiene activo el modo nocturno o no para asignar la clase correspondiente al estilo nocturno
   */
  getDarkMode() {
    if (this.user.getModoNocturno() == 0 || this.user.getModoNocturno() == null) {
      this._document.body.classList.remove('dark-theme');
    } else {
      this._document.body.classList.add('dark-theme');
    }
  }

}
