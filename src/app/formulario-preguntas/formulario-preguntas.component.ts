import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith, debounce, switchMap, debounceTime } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { QuillEditorComponent } from 'ngx-quill';
import { QuillService } from '../providers/quill.service';
import { UtilsService } from '../providers/utils.service';

@Component({
  selector: 'app-formulario-preguntas',
  templateUrl: './formulario-preguntas.component.html',
  styleUrls: ['./formulario-preguntas.component.scss']
})
export class FormularioPreguntasComponent implements OnInit, AfterViewInit {

  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: '', id_estado_flujo: 1, muestra_fecha_actualizacion: 0 };
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
  quillModules;
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

  @ViewChildren(QuillEditorComponent) editores?: QueryList<QuillEditorComponent>;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef,
    private qs: QuillService, private utilsService: UtilsService) {
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

    this.quillModules = {
      syntax: true,
      toolbar: {
        container: [['bold', 'italic'],        // toggled buttons

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],

        ['link', 'image', 'video'],],
      }
    };
  }

  quillModulesFc(ql: any) {
    setTimeout(() => { ql.getModule('toolbar').addHandler('image', () => { this.qs.fileStorageHandler(ql) }); }, 1000);
  }
  ngAfterViewInit() {
    /*
    if(this.quillModules){
      this.quillModules.forEach(e=>{
        
        /*let a:any = e;
        a.getModule('toolbar').addHandler('image', () => {
          this.qs.fileStorageHandler(a);
        });
      })
    }*/
  }

  ngOnInit() {

  }

  cambiarBusqueda(value){
    console.log(value);
    this.texto_buscador = value
    this.buscador = true;
    return this.texto_buscador;
  }


  init() {

    //this.titulo_control.valueChanges.pipe(debounceTime(200), switchMap(value => this.cambiarBusqueda(value)));

    this.ajax.get('preguntas/obtener', {}).subscribe(p => {
      if (p.success) {

        this.options = p.preguntas;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.options, value, 'titulo'))
        );
      }
    })

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

    this.ajax.get('producto/obtener', {}).subscribe(d => {
      if (d.success) {

        this.productos = d.productos;
        if (this.id_pregunta_editar != "nuevo") {
          this.editar = true;
          this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(p => {
            if (p.success) {

              this.pregunta = p.pregunta[0];
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
      }
    })

    this.ajax.get('estado-pregunta/obtener', {}).subscribe(d => {
      if (d.success) {

        this.estados_pregunta = d.estados_pregunta;
      }
    })
  }

  guardarPregunta() {

    if (this.pregunta.titulo == "" || this.pregunta.id_producto == "" || this.pregunta.id_estado == "") {

      swal.fire({
        title: 'Complete los campos obligatorios',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      })

    } else {

      if (this.editar) {

        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }
        this.ajax.post('preguntas/editar', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, cargos_asociados: this.cargos_asociados }).subscribe(d => {
          if (d.success) {

            this.router.navigate(['/ad-preguntas']);
          }
        })
      } else {

        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        //this.pregunta.id_estado_flujo = 4;
        this.pregunta.id_usuario = this.id_usuario;
        this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }

        this.ajax.post('preguntas/guardar', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, cargos_asociados: this.cargos_asociados }).subscribe(d => {
          if (d.success) {

            this.router.navigate(['/ad-preguntas']);
          }
        })
      }

    }

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

  verificarPreguntaAsociada(pregunta) {

  }

  private _filter(value: any): string[] {

    if (value.nombre) {
      const filterValue = value.nombre.toLowerCase();
      return this.options2.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    } else {
      const filterValue = value.toLowerCase();
      return this.options2.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }

  }

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

      this.myControl = new FormControl(e.titulo);
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this.utilsService.filter(this.preguntas_adicion, value, 'titulo'))
      );
      this.cg.detectChanges();
    } else {
      this.myControl = new FormControl(e.titulo);
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

  }


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

      this.myControl2 = new FormControl('');
      this.filteredOptions2 = this.myControl2.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
      this.cg.detectChanges();
    } else {
      this.myControl2 = new FormControl(e.nombre);
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
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
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

}
