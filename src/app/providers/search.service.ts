import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';
import { OrigenDrive, ResultadoCloudSearch, Busqueda } from '../../schemas/interfaces';
import { MomentDate } from '../../pipes/momentDate';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { ChatService } from './chat.service';
import { UtilsService } from './utils.service';
import Swal from 'sweetalert2';
import { resolve } from 'url';
 

const moment = _rollupMoment || _moment;
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  user: User;
  busqueda_actual: Busqueda;
  cantidad_busquedas: number;
  fecha_inicio_busquedas: any | Date;
  constructor(private ajax: AjaxService, private userService: UserService, private chatService: ChatService, private utilsService: UtilsService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u
        //this.callTestEsquema();
        //this.callTestEsquemaChat();
        //this.callTestEsquemaConecta();
      }
    });

    this.fecha_inicio_busquedas = localStorage.getItem('fib');
    let cant = localStorage.getItem('cmc');
    if (cant) {
      this.cantidad_busquedas = parseInt(cant);
    }
    if (this.fecha_inicio_busquedas) {
      this.fecha_inicio_busquedas = moment(parseInt(this.fecha_inicio_busquedas));
    }
    let b = localStorage.getItem('ubc');
    if (b) {
      this.busqueda_actual = JSON.parse(b);
    }
    setInterval(() => {
      this.validaOpenChat();
    }, 1000);
  }

  obtenerPreguntas(limite?: number, pagina?: number): Promise<any> {

    if (!pagina) {
      pagina = 0;
    }
    if (!limite) {
      limite = 50;
    }
    return new Promise(resolve => {
      this.ajax.get('preguntas/obtenerPreguntas', { pagina: pagina, limite: limite }).subscribe(p => {
        if (p.success) {
          resolve(p.preguntas);
        }
      })
    })
  }

  totalPreguntas(): Promise<any> {

    return new Promise(resolve => {
      this.ajax.get('preguntas/totalPreguntas', {}).subscribe(p => {
        if (p.success) {
          resolve(p.total);
        }
      })
    })
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
    return this.ajax.postData(url_api, file);
  }

  guardarBusqueda(json: any) {
    const url_api = `home/busquedaUsuarios/insert`;
    return this.ajax.post(url_api, json);
  }

  async validaOpenChat() {
    let a = await this.utilsService.getConfiguraciones();
    let tiempo_minimo = parseInt(this.utilsService.buscarConfiguracion('cantidad_minutos_minimo_chat').valor);
    let consultas_minimas = parseInt(this.utilsService.buscarConfiguracion('cantidad_consultas_minima_chat').valor);
    if (this.busqueda_actual) {
      if (this.cantidad_busquedas && this.fecha_inicio_busquedas) {
        let diff = moment().utc().diff(this.fecha_inicio_busquedas.utc(), 'seconds');
        let segundos = tiempo_minimo * 60;
        if (this.cantidad_busquedas >= consultas_minimas && diff >= segundos) {
          //console.log('abrir chat', this.busqueda_actual);
          let id_busqueda = this.busqueda_actual.idtbl_busqueda_usuario;
          delete this.busqueda_actual;
          delete this.cantidad_busquedas;
          delete this.fecha_inicio_busquedas;
          localStorage.removeItem('fib');
          localStorage.removeItem('cmc');
          localStorage.removeItem('ubc');
          Swal.fire({
            title: '¿Deseas buscar un experto?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
            confirmButtonText: 'Si',
            cancelButtonClass: 'custom__btn custom__btn--cancel',
            cancelButtonText: 'No',
            customClass: {
              container: 'custom-sweet'
            }
          }).then((result) => {
            if (result.value) {
              this.chatService.crearConversacion(null, id_busqueda);
            }
          })
        } else {
          //console.log(this.cantidad_busquedas, diff, segundos);
        }

        // console.log(diff, moment(), this.fecha_inicio_busquedas);
      }
    }
  }



  queryCloudSearch(query: string, tipo: number, origen: string, page?: number, guardar?: boolean, url?: string): Promise<any> {
    let start;
    if (!page) {
      start = 0;
    } else {
      start = 10 * page;
    }

    return new Promise((resolve, reject) => {


      console.log('cargo', this.user.nombre_perfil);
      let datos = { token: this.user.token_acceso, query: query, id_usuario: this.user.getId(), correo: this.user.getCorreo(), start: start, tipo: tipo, url: url, origen: origen, cargo: this.user.nombre_perfil };
      if (guardar) {
        this.ajax.post('preguntas/cloud-search/guardar-historial', datos).subscribe(d => {
          if (d.success) {
            this.busqueda_actual = d.busqueda;
            localStorage.setItem('ubc', JSON.stringify(this.busqueda_actual));
          }
        });
        if (!this.cantidad_busquedas) {
          this.cantidad_busquedas = 1;
        } else {
          this.cantidad_busquedas++;
        }
        localStorage.setItem('cmc', this.cantidad_busquedas + '');
        if (!this.fecha_inicio_busquedas) {
          this.fecha_inicio_busquedas = moment().utc();
          //console.log(this.fecha_inicio_busquedas);
          localStorage.setItem('fib', this.fecha_inicio_busquedas.unix());
        }
      }
      this.ajax.post('preguntas/cloud-search/query', datos).subscribe(async d => {
        if (d.success) {
          d.resultados.results = (d.resultados.results) ? d.resultados.results : [];
          if (origen == 'conecta') {
            for (let index = 0; index < d.resultados.results.length; index++) {
              const r = d.resultados.results[index];
              let tmp = r.url.split('/');

              // console.log(tmp)
              r.idtbl_pregunta = parseInt(tmp[tmp.length - 1]);
              this.obtenerPregunta(r.idtbl_pregunta).then(pregunta => {
                //console.log('paso por aca', pregunta);
                //r.contenido = pregunta.respuesta.replace(/<[^>]*>/g, '');
                let tmp_url = pregunta.respuesta.split('iconodrive=');
                if (tmp_url.length > 1) {
                  let indice = tmp_url[1].indexOf('"');
                  let url_drive = tmp_url[1].substring(0, indice);
                  //console.log(url_drive);
                  r.url_drive = url_drive;
                }
                if (r.metadata.source.name == environment.pais[this.user.pais].id_origen_conecta) {
                  r.url_icono = pregunta.icono_padre;
                }
                //console.log(this.respuesta, pregunta);
                //this.mostrando = true;
                /*if (index == d.resultados.results.length - 1) {
                  resolve(d.resultados);
                }*/
              });

            }
            resolve(d.resultados);
          } else {
            resolve(d.resultados);
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
      this.ajax.post('preguntas/cloud-search/suggest', { token: this.user.token_acceso, query: query, correo: this.user.getCorreo() }).subscribe(d => {
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

  callTestEsquemaChat() {
    this.ajax.post('connector_drive/cloud-search/crearEsquemaChat', {}).subscribe(d => {

    });
  }
  callTestEsquemaConecta() {
    this.ajax.post('connector_drive/cloud-search/crearEsquemaConecta', {}).subscribe(d => {
      
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
