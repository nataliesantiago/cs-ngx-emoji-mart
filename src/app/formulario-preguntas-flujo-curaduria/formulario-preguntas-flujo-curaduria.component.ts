import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith, debounceTime, switchMap } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { QuillService } from '../providers/quill.service';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
import { UtilsService } from '../providers/utils.service';
import { ChatService } from '../providers/chat.service';
import { Location } from '@angular/common';
import { SearchService } from '../providers/search.service';
import { ResultadoCloudSearch } from '../../schemas/interfaces';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-formulario-preguntas-flujo-curaduria',
  templateUrl: './formulario-preguntas-flujo-curaduria.component.html',
  styleUrls: ['./formulario-preguntas-flujo-curaduria.component.scss']
})
export class FormularioPreguntasFlujoCuraduriaComponent implements OnInit {

  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: 1, id_estado_flujo: 2, muestra_fecha_actualizacion: 0, id_usuario_revision: null };
  segmentos = [];
  subrespuestas = [];
  subrespuestas_segmentos = [];
  usuario;
  id_usuario;
  id_pregunta_editar;
  editar = false;
  estados_pregunta;
  cant_segmentos = 0;
  cant_subrespuestas = 0;
  arr = Array;
  cant_subrespuestas_segmento = 0;
  array_mostrar = [];
  preguntas_todas = [];
  myControl = new FormControl();
  options = [];
  filteredOptions: Array<any>;
  preguntas_adicion = [];
  displayedColumns = ['id', 'pregunta', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  file: any;
  file2;
  notas = { notas: '', id_usuario_comentario: 0 };
  todos_usuarios = [];
  notas_mostrar = [];
  validar_flujo;
  myControl2 = new FormControl();
  options2;
  filteredOptions2: Observable<string[]>;
  cargos_asociados = [];
  displayedColumns2 = ['id', 'cargo', 'acciones'];
  paginator2: MatPaginator;
  sort2: MatSort;
  dataSource2 = new MatTableDataSource([]);
  titulo_control = new FormControl();
  texto_buscador: string;
  buscador = false;
  rol_usuario;
  nombre_boton = "Aprobar";
  ambiente = environment.ambiente;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef,
    private qs: QuillService, private utilsService: UtilsService, private chatService: ChatService, private location: Location, private searchService: SearchService) {


    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
      this.rol_usuario = this.usuario.id_rol;
      this.init();
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      this.rol_usuario = u.id_rol;
      if (this.usuario) {
        this.id_usuario = this.usuario.idtbl_usuario;
        this.init();
      }
    })

    this.ajax.get('user/obtener-todos-curador', {}).subscribe(d => {
      if (d.success) {
        this.todos_usuarios = d.usuario;
      }
    });
    if (this.chatService.sugerencia_activa) {
      this.pregunta.respuesta = this.chatService.texto_mensajes_sugeridos;
    }
  }

  quillModulesFc(ql: any, contenido: any, index?: number) {
    //console.log(ql.getModule('toolbar'))
    ql.getModule('toolbar')
    setTimeout(() => {
      ql.getModule('toolbar').addHandler('video', () => {
        this.qs.fileVideoHandler(ql).then(html => {
          if (contenido == 1) {
            this.pregunta.respuesta = ql.getText();
          } else if (contenido == 2) {
            this.segmentos[index].respuesta = ql.getText();
          } else if (contenido == 3) {
            this.array_mostrar[index].respuesta = ql.getText();
          } else if (contenido == 4) {
            this.subrespuestas[index].respuesta = ql.getText();
          }
        })
      });
    }, 1000);

  }

  ngOnInit() {

  }

  /**
   * realiza una busqueda para validar si la pregunta ya existe
   * @param value 
   */
  cambiarBusqueda(value) {

    this.texto_buscador = value
    this.buscador = true;
    return this.texto_buscador;
  }

  buscarPreguntas(query: string) {

    if (query && query != '')
      this.searchService.queryCloudSearch(query, 1, 'conecta', 0, false).then(preguntas => {

        let tmp = [];
        preguntas.results.forEach((r: ResultadoCloudSearch) => {
          let id = r.metadata.fields.find(f => {
            return f.name == 'id';
          }).textValues.values[0];
          let titulo = r.title;
          tmp.push({ idtbl_pregunta: id, titulo: titulo });
        });
        this.filteredOptions = tmp;
      });
    return [];
  }

  /**
   * inicializa la informacion necesaria
   */
  init() {

    this.myControl.valueChanges
      .pipe(
        debounceTime(200),
        switchMap(value => this.buscarPreguntas(value))
      ).subscribe(d => {
        console.log(d);
      });

    this.user.getPerfilesUsuario().then(p => {
      this.options2 = p;
      this.filteredOptions2 = this.myControl2.valueChanges.pipe(
        startWith(''),
        map(value2 => this.utilsService.filter(this.options2, value2, 'nombre'))
      );
    })

    this.route.params
      .filter(params => params.id_pregunta)
      .subscribe(params => {


        this.id_pregunta_editar = params.id_pregunta;

      });

    if (this.id_pregunta_editar == "sugerida" || this.id_pregunta_editar == "nuevo") {
      this.nombre_boton = "Guardar";
    }

    this.ajax.get('producto/obtener-ordenado-nombre', {}).subscribe(d => {
      if (d.success) {

        this.productos = d.productos;
        if (this.id_pregunta_editar != "nuevo") {
          if (this.id_pregunta_editar != "sugerida") {
            this.editar = true;
            this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(p => {
              if (p.success) {

                this.pregunta = p.pregunta[0];
                this.validar_flujo = p.pregunta[0].id_usuario_revision;
                if (p.pregunta[0].id_estado_flujo == 4) {
                  this.nombre_boton = "Guardar";
                }
                this.pregunta.id_usuario = p.pregunta[0].id_usuario_creacion;
                this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(sr => {
                  if (sr.success) {

                    this.subrespuestas = sr.subrespuesta;
                    for (let i = 0; i < this.subrespuestas.length; i++) {
                      this.subrespuestas[i].respuesta = this.subrespuestas[i].texto;
                    }

                    this.ajax.get('preguntas/obtener-segmentos', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(sg => {
                      if (sg.success) {

                        this.segmentos = sg.segmentos;
                        for (let i = 0; i < this.segmentos.length; i++) {
                          this.segmentos[i].respuesta = this.segmentos[i].texto;
                        }

                        this.ajax.get('preguntas/obtener-subrespuesta-segmentos', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(srsg => {
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

                            this.ajax.get('preguntas/obtener-preguntas-asociadas', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(pras => {
                              if (pras.success) {

                                this.preguntas_adicion = pras.preguntas_asociadas;
                                this.dataSource = new MatTableDataSource(this.preguntas_adicion);
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                this.ajax.get('preguntas/obtener-comentarios-pregunta', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(com => {
                                  if (com.success) {
                                    for (let i = 0; i < com.comentarios.length; i++) {
                                      com.comentarios[i].fecha = moment(com.comentarios[i].fecha).tz('America/Bogota').format('YYYY-MM-DD HH:mm');
                                    }
                                    this.notas_mostrar = com.comentarios;
                                    this.ajax.get('preguntas/obtener-cargos-asociados', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(carg => {
                                      if (carg.success) {
                                        this.cargos_asociados = carg.cargos_asociados;
                                        this.dataSource2 = new MatTableDataSource(this.cargos_asociados);
                                        this.dataSource2.paginator = this.paginator2;
                                        this.dataSource2.sort = this.sort2;
                                        this.cg.detectChanges();
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })

              }
            })
          }
        }
      }
    })

    this.ajax.get('estado-pregunta/obtener', {}).subscribe(d => {
      if (d.success) {

        this.estados_pregunta = d.estados_pregunta;
      }
    })

  }

  /**
   * crea una nueva pregunta
   */
  guardarPregunta() {

    let enviar_correo = false;

    if (this.pregunta.titulo == "" || (this.id_pregunta_editar != "sugerida" && this.pregunta.id_producto == "")) {

      swal.fire({
        title: 'Complete los campos obligatorios',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
      })

    } else {

      if (this.editar) {

        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        if (this.pregunta.id_estado_flujo == 1) {
          this.pregunta.id_estado = 1;
          this.pregunta.id_estado_flujo = 2;
        } else if (this.pregunta.id_estado_flujo == 2) {
          this.pregunta.id_estado_flujo = 3;
        } else if (this.pregunta.id_estado_flujo == 3) {
          this.pregunta.id_estado_flujo = 4;
          enviar_correo = true;
        } else if (this.pregunta.id_estado_flujo == 4) {
          this.pregunta.id_estado_flujo = 3;
        }

        if (!this.validar_flujo && this.id_pregunta_editar != "sugerida") {
          this.pregunta.id_estado_flujo = 2;
          if (this.pregunta.id_usuario_revision) {
            this.pregunta.id_estado_flujo = 1;
          }
        }

        this.notas.id_usuario_comentario = this.id_usuario;

        //this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }

        if (!this.pregunta.id_usuario_revision || this.pregunta.id_usuario_revision == 'undefined' || this.pregunta.id_usuario_revision == null) {

          swal.fire({
            title: 'Debe seleccionar un curador',
            text: '',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'custom__btn custom__btn--accept',
            confirmButtonText: 'Aceptar',
          })

        } else {
          this.ajax.post('preguntas/editar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas, cargos_asociados: this.cargos_asociados }).subscribe(d => {
            if (d.success) {
              console.log(enviar_correo);
              if (enviar_correo) {
                this.ajax.post('email/correo-aprobacion-pregunta', { pregunta: this.pregunta }).subscribe(d => {
                  console.log(d);
                  if (d.success) {
                    this.location.back();
                  }
                })
              } else {
                this.location.back();
              }

            }
          })

        }

      } else {

        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        this.pregunta.id_usuario = this.id_usuario;
        //this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }
        if (this.id_pregunta_editar == "sugerida") {
          this.pregunta.id_estado_flujo = 2;
          this.pregunta.id_estado = 1;
          this.pregunta.id_usuario_revision = null;
          delete this.pregunta.id_producto;
        } else {
          if (this.rol_usuario == 7) {
            this.pregunta.id_estado_flujo = 3;
          }
          if (this.pregunta.id_usuario_revision) {
            this.pregunta.id_estado_flujo = 1;
          } else {
            this.pregunta.id_usuario_revision = this.id_usuario;
          }
        }

        this.ajax.post('preguntas/guardar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas, cargos_asociados: this.cargos_asociados }).subscribe(d => {
          if (d.success) {
            this.chatService.sugerencia_activa = false;
            if (this.id_pregunta_editar == "sugerida") {
              this.router.navigate(['/home']);
              setTimeout(() => {
                swal.fire(
                  '¡Gracias por ayudarnos a mejorar Conecta!',
                  'Tu pregunta ha sido recibida y pronto será validada por el equipo Conecta',
                  'success'
                )
              }, 0);

            } else {
              this.location.back();
            }

          }
        })
      }

    }

  }

  /**
   * rechaza una pregunta especifica
   */
  rechazarPregunta() {

    swal.fire({
      title: 'Rechazar Pregunta',
      text: "Confirme para rechazar la pregunta",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Rechazar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (this.pregunta.id_estado_flujo == 2 && !this.pregunta.id_usuario_revision) {
          if (!this.notas.notas || this.notas.notas == "" || this.notas.notas == " ") {
            swal.fire({
              title: 'Debe ingresar un comentario',
              text: "Ingrese un comentario para poder rechazar la pregunta",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
              confirmButtonText: 'Aceptar'
            }).then((result) => {

            })
          } else {
            if (this.pregunta.muestra_fecha_actualizacion) {
              this.pregunta.muestra_fecha_actualizacion = 1;
            } else {
              this.pregunta.muestra_fecha_actualizacion = 0;
            }
            if (this.pregunta.id_estado_flujo == 2) {
              this.pregunta.id_estado_flujo = 1;
              if (!this.pregunta.id_usuario_revision) {
                this.pregunta.id_estado = 4;
                this.pregunta.id_estado_flujo = 2;
              }
            } else if (this.pregunta.id_estado_flujo == 3) {
              this.pregunta.id_estado_flujo = 2;
            } else if (this.pregunta.id_estado_flujo == 4) {
              this.pregunta.id_estado_flujo = 3;
            } else if (this.pregunta.id_estado_flujo == 1) {
              this.pregunta.id_estado = 4;
              this.pregunta.id_estado_flujo = 1;
            }

            this.notas.id_usuario_comentario = this.id_usuario;

            this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
            for (let i = 0; i < this.array_mostrar.length; i++) {
              this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
            }
            this.ajax.post('preguntas/editar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas, cargos_asociados: this.cargos_asociados }).subscribe(d => {
              if (d.success) {

                this.location.back();
              }
            })
          }
        } else if (this.pregunta.id_estado_flujo == 1) {
          if (!this.notas.notas || this.notas.notas == "" || this.notas.notas == " ") {
            swal.fire({
              title: 'Debe ingresar un comentario',
              text: "Ingrese un comentario para poder rechazar la pregunta",
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
              confirmButtonText: 'Aceptar'
            }).then((result) => {

            })
          } else {
            if (this.pregunta.id_estado_flujo == 1) {
              this.pregunta.id_estado = 4;
              this.pregunta.id_estado_flujo = 1;
            }

            this.notas.id_usuario_comentario = this.id_usuario;

            this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
            for (let i = 0; i < this.array_mostrar.length; i++) {
              this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
            }
            this.ajax.post('preguntas/editar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas, cargos_asociados: this.cargos_asociados }).subscribe(d => {
              if (d.success) {

                this.location.back();
              }
            })
          }
        } else {
          if (this.pregunta.muestra_fecha_actualizacion) {
            this.pregunta.muestra_fecha_actualizacion = 1;
          } else {
            this.pregunta.muestra_fecha_actualizacion = 0;
          }
          if (this.pregunta.id_estado_flujo == 2) {
            this.pregunta.id_estado_flujo = 1;
            if (!this.pregunta.id_usuario_revision) {
              this.pregunta.id_estado = 4;
              this.pregunta.id_estado_flujo = 2;
            }
          } else if (this.pregunta.id_estado_flujo == 3) {
            this.pregunta.id_estado_flujo = 2;
          } else if (this.pregunta.id_estado_flujo == 4) {
            this.pregunta.id_estado_flujo = 3;
          } else if (this.pregunta.id_estado_flujo == 1) {
            this.pregunta.id_estado = 4;
            this.pregunta.id_estado_flujo = 1;
          }

          this.notas.id_usuario_comentario = this.id_usuario;

          this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
          for (let i = 0; i < this.array_mostrar.length; i++) {
            this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
          }
          this.ajax.post('preguntas/editar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas, cargos_asociados: this.cargos_asociados }).subscribe(d => {
            if (d.success) {

              this.location.back();
            }
          })
        }

      }
    })
  }

  /**
   * crea un nuevo segmento
   */
  anadirSegmento() {
    this.segmentos.push({ titulo: '', respuesta: '' });
  }

  /**
   * crea una nueva subrespuesta
   */
  anadirSubRespuesta() {
    this.subrespuestas.push({ titulo: '', respuesta: '', posicion: 2, categoria: '' });
  }

  eliminarSegmento(e, pos) {

    swal.fire({
      title: 'Eliminar Segmento',
      text: "Confirme para eliminar el segmento",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (this.editar) {

          if (e.idtbl_segmento != undefined) {
            this.ajax.post('preguntas/eliminar-segmento', { segmento: e }).subscribe(d => {
              if (d.success) {
                this.segmentos.splice(pos, 1);
                for (let i = 0; i < this.array_mostrar.length; i++) {
                  if (this.array_mostrar[i].pos_segmento == pos) {
                    this.array_mostrar.splice(i, 1);
                    i = 0;
                  }
                }
                this.cg.detectChanges();
              }
            })
          } else {
            this.segmentos.splice(pos, 1);
            for (let i = 0; i < this.array_mostrar.length; i++) {
              if (this.array_mostrar[i].pos_segmento == pos) {
                this.array_mostrar.splice(i, 1);
                i = 0;
              }
            }
            this.cg.detectChanges();
          }
        } else {
          this.segmentos.splice(pos, 1);
          for (let i = 0; i < this.array_mostrar.length; i++) {
            if (this.array_mostrar[i].pos_segmento == pos) {
              this.array_mostrar.splice(i, 1);
              i = 0;
            }
          }
          this.cg.detectChanges();
        }
      }
    })
  }

  /**
   * desactiva una subrespuesta especifica
   * @param e 
   * @param pos 
   */
  eliminarSubRespuesta(e, pos) {
    swal.fire({
      title: 'Eliminar Subrespuesta',
      text: "Confirme para eliminar la subrespuesta",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (this.editar) {

          if (e.idtbl_subrespuesta != undefined) {
            this.ajax.post('preguntas/eliminar-subrespuesta', { subrespuesta: e }).subscribe(d => {
              if (d.success) {
                this.subrespuestas.splice(pos, 1);
                this.cg.detectChanges();
              }
            })
          } else {
            this.subrespuestas.splice(pos, 1);
            this.cg.detectChanges();
          }
        } else {
          this.subrespuestas.splice(pos, 1);
          this.cg.detectChanges();
        }
      }
    })
  }

  /**
   * valida un segmento especifico
   * @param e 
   */
  validarSegmento(e) {
    /*this.array_mostrar = [];
    this.cant_subrespuestas_segmento = 0;
    for(let i of this.subrespuestas_segmentos){
      if(i.pos_segmento == e){
        this.array_mostrar.push(i);
      }
    }*/
  }

  /**
   * crea una sub respuesta a un segmento especifico
   * @param e 
   */
  anadirSubRespuestaSegmento(e) {
    this.array_mostrar.push({ titulo: '', respuesta: '', pos_segmento: e, segmento: '' });

    /*for(let i of this.subrespuestas_segmentos){
      if(i.pos_segmento == e){
        this.array_mostrar.push(i);
      }
    }*/

  }

  /**
   * desactiva una sub respuesta a un segmento especifico
   * @param e 
   * @param pos 
   */
  eliminarSubRespuestaSegmento(e, pos) {
    swal.fire({
      title: 'Eliminar Subrespuesta del segmento',
      text: "Confirme para eliminar la subrespuesta del segmento",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (this.editar) {

          if (e.idtbl_subrespuesta != undefined) {
            this.ajax.post('preguntas/eliminar-subrespuesta', { subrespuesta: e }).subscribe(d => {
              if (d.success) {
                this.array_mostrar.splice(pos, 1);
                this.cg.detectChanges();
              }
            })
          } else {
            this.array_mostrar.splice(pos, 1);
            this.cg.detectChanges();
          }
        } else {
          this.array_mostrar.splice(pos, 1);
          this.cg.detectChanges();
        }
      }
    })
  }

  /**
   * verifica una pregunta asociada
   * @param pregunta 
   */
  verificarPreguntaAsociada(pregunta) {

  }

  /**
   * realiza el filtro correspondiente de la informacion asociada
   * @param value 
   */
  private _filter(value: any): string[] {

    if (value.nombre) {
      const filterValue = value.nombre.toLowerCase();
      return this.options2.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    } else {
      const filterValue = value.toLowerCase();
      return this.options2.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }

  }

  /**
   * crea una pregunta asociada a una pregunta especifica
   * @param e 
   */
  anadirPreguntaAsociada(e) {
    let validador = true;
    for (let i = 0; i < this.preguntas_adicion.length; i++) {
      if (this.preguntas_adicion[i].idtbl_pregunta == e.idtbl_pregunta) {
        validador = false;
      }
    }

    if (validador) {
      this.preguntas_adicion.push(e);

      this.dataSource = new MatTableDataSource(this.preguntas_adicion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;



      this.cg.detectChanges();
    } else {



      this.cg.detectChanges();
      swal.fire({
        title: 'La pregunta ya fue asociada previamente',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      })
    }
    this.myControl.setValue('');
  }

  /**
   * desactiva una pregunta asociada a la pregunta
   * @param e 
   */
  borrarElemento(e) {

    swal.fire({
      title: 'Desasociar pregunta',
      text: "Confirme para eliminar la asociación",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        if (this.editar) {
          if (e.idtbl_respuesta_asociada != undefined) {
            this.ajax.post('preguntas/eliminar-asociacion', { preguna_asociada: e }).subscribe(d => {
              if (d.success) {
                let pos = 0;
                for (let i = 0; i < this.preguntas_adicion.length; i++) {
                  if (this.preguntas_adicion[i].idtbl_pregunta == e.idtbl_pregunta) {
                    pos = i;
                  }
                }
                this.preguntas_adicion.splice(pos, 1);
                this.dataSource = new MatTableDataSource(this.preguntas_adicion);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.cg.detectChanges();
              }
            })
          } else {
            let pos = 0;
            for (let i = 0; i < this.preguntas_adicion.length; i++) {
              if (this.preguntas_adicion[i].idtbl_pregunta == e.idtbl_pregunta) {
                pos = i;
              }
            }
            this.preguntas_adicion.splice(pos, 1);
            this.dataSource = new MatTableDataSource(this.preguntas_adicion);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.cg.detectChanges();
          }
        } else {
          let pos = 0;
          for (let i = 0; i < this.preguntas_adicion.length; i++) {
            if (this.preguntas_adicion[i].idtbl_pregunta == e.idtbl_pregunta) {
              pos = i;
            }
          }
          this.preguntas_adicion.splice(pos, 1);
          this.dataSource = new MatTableDataSource(this.preguntas_adicion);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cg.detectChanges();
        }
      }
    })
  }

  /**
   * crea un cargo asociado a la pregunta
   * @param e 
   */
  anadirCargoAsociado(e) {
    let validador = true;
    for (let i = 0; i < this.cargos_asociados.length; i++) {
      if (this.cargos_asociados[i].idtbl_perfil == e.idtbl_perfil) {
        validador = false;
      }
    }

    if (validador) {
      this.cargos_asociados.push(e);

      this.dataSource2 = new MatTableDataSource(this.cargos_asociados);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;

      this.myControl2 = new FormControl();
      this.user.getPerfilesUsuario().then(p => {
        this.options2 = p;
        this.filteredOptions2 = this.myControl2.valueChanges.pipe(
          startWith(''),
          map(value2 => this.utilsService.filter(this.options2, value2, 'nombre'))
        );
      })
      this.cg.detectChanges();
    } else {
      this.myControl2 = new FormControl();
      this.user.getPerfilesUsuario().then(p => {
        this.options2 = p;
        this.filteredOptions2 = this.myControl2.valueChanges.pipe(
          startWith(''),
          map(value2 => this.utilsService.filter(this.options2, value2, 'nombre'))
        );
      })
      swal.fire({
        title: 'El cargo ya fue asociado previamente',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      })
    }

  }

  /**
   * desactiva un cargo asociado a la pregunta
   * @param e 
   */
  borrarCargo(e) {

    swal.fire({
      title: 'Desasociar cargo',
      text: "Confirme para eliminar el cargo",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        if (this.editar) {

          if (e.idtbl_pregunta_has_tbl_perfil != undefined) {
            this.ajax.post('preguntas/eliminar-asociacion-cargo', { cargo_asociado: e }).subscribe(d => {
              if (d.success) {
                let pos = 0;
                for (let i = 0; i < this.cargos_asociados.length; i++) {
                  if (this.cargos_asociados[i].idtbl_perfil == e.idtbl_perfil) {
                    pos = i;
                  }
                }
                this.cargos_asociados.splice(pos, 1);
                this.dataSource2 = new MatTableDataSource(this.cargos_asociados);
                this.dataSource2.paginator = this.paginator2;
                this.dataSource2.sort = this.sort2;
                this.cg.detectChanges();
              }
            })
          } else {
            let pos = 0;
            for (let i = 0; i < this.cargos_asociados.length; i++) {
              if (this.cargos_asociados[i].idtbl_perfil == e.idtbl_perfil) {
                pos = i;
              }
            }
            this.cargos_asociados.splice(pos, 1);
            this.dataSource2 = new MatTableDataSource(this.cargos_asociados);
            this.dataSource2.paginator = this.paginator2;
            this.dataSource2.sort = this.sort2;
            this.cg.detectChanges();
          }
        } else {
          let pos = 0;
          for (let i = 0; i < this.cargos_asociados.length; i++) {
            if (this.cargos_asociados[i].idtbl_perfil == e.idtbl_perfil) {
              pos = i;
            }
          }
          this.cargos_asociados.splice(pos, 1);
          this.dataSource2 = new MatTableDataSource(this.cargos_asociados);
          this.dataSource2.paginator = this.paginator2;
          this.dataSource2.sort = this.sort2;
          this.cg.detectChanges();
        }
      }
    })
  }

  /**
   * redirecciona a una nueva ventana dependiendo las acciones realizadas
   */
  regresarPagina() {
    if (this.id_pregunta_editar == "sugerida") {
      this.router.navigate(['/home']);
    } else {
      this.location.back();

    }
  }

}
