import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';
import { OrigenDrive, ResultadoCloudSearch, Busqueda } from '../../schemas/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  user: User;
  constructor(private ajax: AjaxService, private userService: UserService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u
        this.callTest();
        // this.callTestEsquema();
      }
    });
  }

  busqueda_actual: Busqueda;


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

  queryCloudSearch(query: string, tipo: number, origen: string, page?: number, url?: string): Promise<any> {
    let start;
    if (!page) {
      start = 0;
    } else {
      start = 10 * page;
    }
    return new Promise((resolve, reject) => {
      this.ajax.get('preguntas/cloud-search/query', { token: this.user.token_acceso, query: query, id_usuario: this.user.getId(), correo: this.user.getCorreo(), start: start, tipo: tipo, url: url, origen: origen }).subscribe(async d => {
        if (d.success) {
          d.resultados.results = (d.resultados.results) ? d.resultados.results : [];
          for (let index = 0; index < d.resultados.results.length; index++) {
            const r = d.resultados.results[index];
            let tmp = r.url.split('/');
            // console.log(tmp)
            r.idtbl_pregunta = parseInt(tmp[tmp.length - 1]);
            this.obtenerPregunta(r.idtbl_pregunta).then(pregunta => {
              //console.log('paso por aca', pregunta);
              //r.contenido = pregunta.respuesta.replace(/<[^>]*>/g, '');
              if (r.metadata.source.name == environment.id_origen_conecta) {
                r.url_icono = pregunta.icono_padre;
              }
              //console.log(this.respuesta, pregunta);
              //this.mostrando = true;
              if (index == d.resultados.results.length - 1) {
                resolve(d.resultados);
              }
            });

          }
          if (!d.resultados.results || d.resultados.results.length < 1) {
            d.resultados.results = [];
            resolve(d.resultados);
          }

        }
      })
    });
  }

  suggestCloudSearch(query?: string, sugerencias?: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('preguntas/cloud-search/suggest', { token: this.user.token_acceso, query: query, correo: this.user.getCorreo() }).subscribe(d => {
        if (d.success) {
          sugerencias = d.sugerencias;
          resolve(d.sugerencias);
        }
      })
    });
  }

  callTest() {
    this.ajax.get('connector_drive/drive/listFiles', { token: this.user.token_acceso }).subscribe(d => {

    });
  }
  callTestEsquema() {
    this.ajax.post('connector_drive/cloud-search/crearEsquemaDrive', {}).subscribe(d => {

    });
  }

  buscarOrigenesDrive(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('connector_drive/getDrives', {}).subscribe(d => {
        if (d.success) {
          resolve(d.origenes);
        }
      });
    });
  }

  crearOrigenDrive(origen: OrigenDrive): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('connector_drive/drive/crear', origen).subscribe(d => {
        if (d.success) {
          resolve();
        }
      });
    });
  }

  editarOrigenDrive(origen: OrigenDrive): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('connector_drive/drive/editar', origen).subscribe(d => {
        if (d.success) {
          resolve();
        }
      });
    });
  }
  async obtenerPregunta(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: id, search: true }).subscribe(d => {
        if (d.success) {
          resolve(d.pregunta[0]);
        }
      });
    });
  }


}
