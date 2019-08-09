import { Injectable } from '@angular/core';

import { AjaxService } from './ajax.service';
@Injectable({
  providedIn: 'root'
})

export class HistorialUsuariosService {

  token = '';
  constructor(private ajax: AjaxService) {
  }

  getHistorialUsuarios(parametros: any) {

    const url_api = `home/historialTblSearchImplProp/`;
    return this.ajax.post(url_api, parametros);

  }

}
