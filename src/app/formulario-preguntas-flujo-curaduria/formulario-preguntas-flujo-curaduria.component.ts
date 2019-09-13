import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { QuillService } from '../providers/quill.service';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;

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
  filteredOptions: Observable<string[]>;
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

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.ajax.get('preguntas/obtener', {}).subscribe(p => {
      if (p.success) {
        this.preguntas_todas = p.preguntas;
      }
    })
    
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
      this.init();
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
        this.init();
      }
    })

    this.ajax.get('user/obtener-todos', {}).subscribe(d => {
      if (d.success) {
        this.todos_usuarios = d.usuario;
      }
    });
  }

  quillModulesFc(ql: any) {
    //let toolbar = ql.getModule('toolbar');
    //ql.modules = JSON.parse(JSON.stringify(this.quillModules));
    setTimeout(() => { ql.getModule('toolbar').addHandler('image', () => { this.qs.fileStorageHandler(ql) }); }, 1000);
    /*let m = {
      syntax: true,
      toolbar: {
        handlers: { 
          'image': ()=>{this.qs.fileStorageHandler(ql)}
        }
      }
    };
    return m;*/
  }

  ngOnInit() {
    
  }

  init(){

    this.ajax.get('preguntas/obtener', {}).subscribe(p => {
      if (p.success) {

        this.options = p.preguntas;
        /*for(let i = 0; i < p.preguntas.length; i++){
          this.options.push(p.preguntas[i].titulo);
        }*/

        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      }
    })

    this.route.params
      .filter(params => params.id_pregunta)
      .subscribe(params => {


        this.id_pregunta_editar = params.id_pregunta;

      });

    this.ajax.get('producto/obtener', {}).subscribe(d => {
      if (d.success) {

        this.productos = d.productos;
        if (this.id_pregunta_editar != "nuevo") {
          if (this.id_pregunta_editar != "sugerida") {
            this.editar = true;
            this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(p => {
              if (p.success) {

                this.pregunta = p.pregunta[0];
                this.validar_flujo = p.pregunta[0].id_usuario_revision;

                this.pregunta.id_usuario = p.pregunta[0].id_usuario_creacion;
                this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(sr => {
                  if (sr.success) {

                    this.subrespuestas = sr.subrespuesta;
                    for (let i = 0; i < this.subrespuestas.length; i++) {
                      this.subrespuestas[i].respuesta = this.subrespuestas[i].texto;
                    }
                    // console.log("Subrespuestas-cargadas", this.subrespuestas);
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
                                    for(let i = 0; i < com.comentarios.length; i++){
                                      com.comentarios[i].fecha = moment(com.comentarios[i].fecha).tz('America/Bogota').format('YYYY-MM-DD HH:mm');
                                    }
                                    this.notas_mostrar = com.comentarios;
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
        }
      }
    })

    this.ajax.get('estado-pregunta/obtener', {}).subscribe(d => {
      if (d.success) {

        this.estados_pregunta = d.estados_pregunta;
      }
    })

  }

  guardarPregunta() {

    if(this.pregunta.titulo == "" || this.pregunta.id_producto == ""){

      swal.fire(
        'Complete los campos obligatorios',
        '',
        'warning'
      )

    }else{

      if (this.editar) {

        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        if (this.pregunta.id_estado_flujo == 1) {
          this.pregunta.id_estado_flujo = 2;
        } else if (this.pregunta.id_estado_flujo == 2) {
          this.pregunta.id_estado_flujo = 3;
        } else if (this.pregunta.id_estado_flujo == 3) {
          this.pregunta.id_estado_flujo = 4;
        } else if (this.pregunta.id_estado_flujo == 4) {
          this.pregunta.id_estado_flujo = 3;
        }
  
        if (!this.validar_flujo && this.id_pregunta_editar != "sugerida") {
          this.pregunta.id_estado_flujo = 1;
        }

        this.notas.id_usuario_comentario = this.id_usuario;
  
        //this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }
        this.ajax.post('preguntas/editar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas }).subscribe(d => {
          if (d.success) {
  
            this.router.navigate(['/flujo-curaduria']);
          }
        })
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
        }else{
          this.pregunta.id_usuario_revision = this.id_usuario;
        }
  
        this.ajax.post('preguntas/guardar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas }).subscribe(d => {
          if (d.success) {
  
            this.router.navigate(['/flujo-curaduria']);
          }
        })
      }

    }

  }

  rechazarPregunta() {

    swal.fire({
      title: 'Rechazar Pregunta',
      text: "Confirme para rechazar la pregunta",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.value){
        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        if (this.pregunta.id_estado_flujo == 2) {
          this.pregunta.id_estado_flujo = 1;
        } else if (this.pregunta.id_estado_flujo == 3) {
          this.pregunta.id_estado_flujo = 2;
        } else if (this.pregunta.id_estado_flujo == 4) {
          this.pregunta.id_estado_flujo = 3;
        }
    
        this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }
        this.ajax.post('preguntas/editar-curaduria', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, notas: this.notas }).subscribe(d => {
          if (d.success) {
    
            this.router.navigate(['/flujo-curaduria']);
          }
        })
      }
    })
  }

  anadirSegmento() {
    this.segmentos.push({ titulo: '', respuesta: '' });
  }

  anadirSubRespuesta() {
    this.subrespuestas.push({ titulo: '', respuesta: '', posicion: '', categoria: '' });
  }

  eliminarSegmento(e, pos) {

    swal.fire({
      title: 'Eliminar Segmento',
      text: "Confirme para eliminar el segmento",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
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

  eliminarSubRespuesta(e, pos) {
    swal.fire({
      title: 'Eliminar Subrespuesta',
      text: "Confirme para eliminar la subrespuesta",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
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

  validarSegmento(e) {
    /*this.array_mostrar = [];
    this.cant_subrespuestas_segmento = 0;
    for(let i of this.subrespuestas_segmentos){
      if(i.pos_segmento == e){
        this.array_mostrar.push(i);
      }
    }*/
  }

  anadirSubRespuestaSegmento(e) {
    this.array_mostrar.push({ titulo: '', respuesta: '', pos_segmento: e, segmento: '' });

    /*for(let i of this.subrespuestas_segmentos){
      if(i.pos_segmento == e){
        this.array_mostrar.push(i);
      }
    }*/

  }

  eliminarSubRespuestaSegmento(e, pos) {
    swal.fire({
      title: 'Eliminar Subrespuesta del segmento',
      text: "Confirme para eliminar la subrespuesta del segmento",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
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

  private _filter(value: any): string[] {

    if (value.titulo) {
      const filterValue = value.titulo.toLowerCase();
      return this.options.filter(option => option.titulo.toLowerCase().indexOf(filterValue) === 0);
    } else {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.titulo.toLowerCase().indexOf(filterValue) === 0);
    }

  }

  anadirPreguntaAsociada(e) {
    this.preguntas_adicion.push(e);

    this.dataSource = new MatTableDataSource(this.preguntas_adicion);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.myControl = new FormControl(e.titulo);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.cg.detectChanges();
  }

  borrarElemento(e) {

    swal.fire({
      title: 'Desasociar pregunta',
      text: "Confirme para eliminar la asociación",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
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
}
