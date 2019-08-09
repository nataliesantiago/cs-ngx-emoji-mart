import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private ajax: AjaxService) {

  }


  autocompleteText(query: any) {

    var base64 = window.btoa(query);
    const url_api = `home/consultar/${base64}`;
    return this.ajax.get(url_api);
  }

  searchFile(file: any) {
    const url_api = `home/vision`;
    let arreglo = {
      id: 1,
      file: file
    }
    return this.ajax.post(url_api, file);
  }

  guardarBusqueda(json: any) {
    const url_api = `home/busquedaUsuarios/insert`;
    return this.ajax.post(url_api, json);
  }
}
