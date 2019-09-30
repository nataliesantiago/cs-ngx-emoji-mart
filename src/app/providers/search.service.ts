import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  user: User;
  constructor(private ajax: AjaxService, private userService: UserService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
    });
  }


  autocompleteText(query: any) {

    var base64 = window.btoa(query);
    const url_api = `home/consultar/${base64}`;
    return this.ajax.get(url_api, {});
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

  queryCloudSearch(query?: string): Promise<any> {
    if (!query) {
      query = 'prueba';
    }
    return new Promise((resolve, reject) => {
      this.ajax.get('preguntas/cloud-search/query', { token: this.user.token_acceso, query: query }).subscribe(d => {
        if (d.success) {
          resolve();
        }
      })
    });
  }
}
