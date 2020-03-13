import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { ChatService } from '../providers/chat.service';
import { SearchService } from '../providers/search.service';
import { User } from '../../schemas/user.schema';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss']
})
export class RespuestasComponent implements OnInit {

  id_pregunta_visualizar;
  id_usuario;
  usuario: User;
  pregunta: any;
  subrespuestas = [];
  segmentos = [];
  array_mostrar = [];
  preguntas_adicion = [];
  content;
  categorias_subrespuestas_superior = [];
  categorias_subrespuestas_inferior = [];
  observaciones = "";
  nueva_observacion = false;
  valor_calificacion;
  boton = "Enviar";
  activadoSi = false;
  activadoNo = false;
  pregunta_nueva = false;
  dias_pregunta_nueva;
  limite_texto_observacion;
  mensaje_enviado = false;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private chatService: ChatService, private searchService: SearchService) {

    this.usuario = this.user.getUsuario();

    this.user.observableUsuario.subscribe(u => {
      if (u) {
        this.usuario = u;
        this.init();
      } else {
        delete this.usuario;
      }
    });

    route.params.subscribe(val => {
      if (this.usuario) {
        this.init();
      }
    });



  }

  init() {

    this.chatService.obtenerLimiteTexto().then(valor => {
      this.limite_texto_observacion = valor;
    });

    this.ajax.get('administracion/obtener-cantidad-dias-pregunta-nueva').subscribe(r => {
      if (r.success) {
        this.dias_pregunta_nueva = r.item[0].valor;
      }
    })

    this.route.params
      .filter(params => params.id_pregunta)
      .subscribe(params => {

        { order: "popular" }
        this.id_pregunta_visualizar = params.id_pregunta;

      });

    let fecha_actual = moment(new Date());
    let cantidad_flujos_curaduria = 0;
    //obtener-fecha-publicacion-pregunta
    this.ajax.get('preguntas/obtener-fecha-publicacion-pregunta', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(p => {
      cantidad_flujos_curaduria = p.pregunta[0].length;
      if (p.pregunta[0].length != 0) {
        if (p.pregunta[1].length == 1) {
          let registro = p.pregunta[1];
          let fecha_creacion = moment(registro[0].fecha).tz('America/Bogota');

          let diferencia_dias = fecha_actual.diff(fecha_creacion, 'days');

          if (diferencia_dias <= this.dias_pregunta_nueva) {
            this.pregunta_nueva = true;
          }
        }
      } else {
        this.pregunta_nueva = true;
      }
    });
    this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(p => {
      if (p.success) {
        // // console.log('pregunta',p.pregunta[0].fecha_ultima_modificacion)
        p.pregunta[0].fecha_ultima_modificacion = moment(p.pregunta[0].fecha_ultima_modificacion).tz('America/Bogota').format('YYYY-MM-DD');

        this.pregunta = p.pregunta[0];

        if (cantidad_flujos_curaduria == 0) {
          let fecha_creacion = moment(this.pregunta.fecha_creacion).tz('America/Bogota');

          let diferencia_dias = fecha_actual.diff(fecha_creacion, 'days');

          if (diferencia_dias <= this.dias_pregunta_nueva) {
            this.pregunta_nueva = true;
          }
        }

        this.ajax.get('preguntas/obtener-preguntas-asociadas', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(pras => {
          if (pras.success) {
            this.preguntas_adicion = pras.preguntas_asociadas;
            // console.log(pras);
            if (this.preguntas_adicion.length < 5) {
              this.searchService.queryCloudSearch(this.pregunta.titulo, 1, 'conecta', 0, false).then(asociadas => {
                // console.log(asociadas);
                if (asociadas.results) {

                  asociadas.results.filter(f => {
                    return f.idtbl_pregunta != this.pregunta.idtbl_pregunta;
                  }).forEach(a => {
                    if (this.preguntas_adicion.length < 5) {
                      this.preguntas_adicion.push({ titulo: a.title, idtbl_pregunta: a.idtbl_pregunta });
                    }
                  });
                }
              })
            }
            //this.cg.detectChanges();
          }
        });

        this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sr => {
          if (sr.success) {

            this.subrespuestas = sr.subrespuesta;

            for (let i = 0; i < this.subrespuestas.length; i++) {
              let validador = 0;
              if (this.categorias_subrespuestas_superior.length == 0 && this.subrespuestas[i].posicion == 1) {
                this.categorias_subrespuestas_superior.push({ categoria: this.subrespuestas[i].categoria });
              } else {
                if (this.subrespuestas[i].posicion == 1) {
                  for (let j = 0; j < this.categorias_subrespuestas_superior.length; j++) {
                    if (this.subrespuestas[i].categoria == this.categorias_subrespuestas_superior[j].categoria) {
                      validador++;
                    }
                  }
                  if (validador == 0) {
                    this.categorias_subrespuestas_superior.push({ categoria: this.subrespuestas[i].categoria });
                  }
                }
              }
            }

            for (let i = 0; i < this.subrespuestas.length; i++) {
              let validador = 0;
              if (this.categorias_subrespuestas_inferior.length == 0 && this.subrespuestas[i].posicion == 2) {
                this.categorias_subrespuestas_inferior.push({ categoria: this.subrespuestas[i].categoria });
              } else {
                if (this.subrespuestas[i].posicion == 2) {
                  for (let j = 0; j < this.categorias_subrespuestas_inferior.length; j++) {
                    if (this.subrespuestas[i].categoria == this.categorias_subrespuestas_inferior[j].categoria) {
                      validador++;
                    }
                  }
                  if (validador == 0) {
                    this.categorias_subrespuestas_inferior.push({ categoria: this.subrespuestas[i].categoria });
                  }
                }
              }
            }

            this.ajax.get('preguntas/obtener-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sg => {
              if (sg.success) {

                this.segmentos = sg.segmentos;
                for (let i = 0; i < this.segmentos.length; i++) {
                  this.segmentos[i].respuesta = this.segmentos[i].texto;
                }

                this.ajax.get('preguntas/obtener-subrespuesta-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(srsg => {
                  if (srsg.success) {

                    this.array_mostrar = srsg.subrespuestaSegmento;
                    for (let i = 0; i < this.array_mostrar.length; i++) {
                      this.array_mostrar[i].respuesta = this.array_mostrar[i].texto;
                      for (let j = 0; j < this.segmentos.length; j++) {
                        if (this.array_mostrar[i].id_segmento == this.segmentos[j].idtbl_segmento) {
                          this.array_mostrar[i].pos_segmento = j;
                          j = this.segmentos.length + 1;
                        }
                      }
                    }
                  }
                })
              }
            })
          }
        })

      }
      let b = window.sessionStorage.getItem('ubc');
      let id_b;
      if (b) {
        id_b = JSON.parse(b).idtbl_busqueda_usuario;
      }
      this.searchService.guardarTrazabilidad(this.id_pregunta_visualizar, this.usuario.idtbl_usuario, id_b);
    });

  }

  ngOnInit() {

  }

  preguntaAsociada(e) {
    this.router.navigate(['/respuestas', e]);
  }

  calificacion(valor) {
    this.nueva_observacion = true;
    this.valor_calificacion = valor;
    if (valor == 1) {
      this.boton = "Enviar";
      this.activadoSi = true;
      this.activadoNo = false;
    } else {
      if (this.usuario.id_rol == 2 || this.usuario.id_rol == 3) {
        this.boton = "Enviar";
      } else {
        this.boton = "Buscar Experto";
      }
      this.activadoNo = true;
      this.activadoSi = false;
    }
  }

  enviarCalificacion() {

    this.ajax.post('preguntas/observaciones-respuesta', { comentario: this.observaciones, positivo: this.valor_calificacion, id_usuario: this.usuario.idtbl_usuario, id_pregunta: this.id_pregunta_visualizar }).subscribe(d => {
      if (d.success) {
        this.mensaje_enviado = true;
        if (this.valor_calificacion == 2 && this.usuario.id_rol != 2 && this.usuario.id_rol != 3) {
          swal.fire({
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
              let id_busqueda;
              if (this.searchService.busqueda_actual) {
                id_busqueda = this.searchService.busqueda_actual.idtbl_busqueda_usuario;
              }
              console.log('Creando conversacion cliente');
              this.chatService.crearConversacion(this.pregunta.id_producto, id_busqueda, this.id_pregunta_visualizar);
              this.router.navigate(['/home']);
            }
          })
        } else {
          this.router.navigate(['/home']);
        }
      }
    })
  }

  validarPadding(muestra_fecha, pregunta_nueva) {

  }

}
