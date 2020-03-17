  import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith, debounce, switchMap, debounceTime } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource, MatChipInputEvent } from '@angular/material';
import swal from 'sweetalert2';
import { QuillEditorComponent } from 'ngx-quill';
import { QuillService } from '../providers/quill.service';
import { UtilsService } from '../providers/utils.service';
import { SearchService } from '../providers/search.service';
import { ResultadoCloudSearch } from '../../schemas/interfaces';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-formulario-preguntas',
  templateUrl: './formulario-preguntas.component.html',
  styleUrls: ['./formulario-preguntas.component.scss']
})
export class FormularioPreguntasComponent implements OnInit, AfterViewInit {

  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: '', id_estado_flujo: 4, muestra_fecha_actualizacion: 0, keywords: [] };
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
  filteredOptions: Observable<string[]> | Array<any>;
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
  estado_flujo_pregunta = [];
  loading = false;
  selectable = true;
  removable = true;
  separatorKeysCodes = [ENTER, COMMA];
  addOnBlur = true;
  keywords = [];

  @ViewChildren(QuillEditorComponent) editores?: QueryList<QuillEditorComponent>;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef,
    private qs: QuillService, private utilsService: UtilsService, private searchService: SearchService) {


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

  quillModulesFc(ql: any, contenido: any, index?: number) {
    //// console.log(ql.getModule('toolbar'))
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


  init() {

    //this.titulo_control.valueChanges.pipe(debounceTime(200), switchMap(value => this.cambiarBusqueda(value)));

    /*this.ajax.get('preguntas/obtener', {}).subscribe(p => {
      if (p.success) {

        this.options = p.preguntas;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.options, value, 'titulo'))
        );
      }
    })*/
    this.myControl.valueChanges
      .pipe(
        debounceTime(200),
        switchMap(value => this.buscarPreguntas(value))
      ).subscribe(d => {
        // console.log(d);
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

    this.ajax.get('producto/obtener-ordenado-nombre', {}).subscribe(d => {
      if (d.success) {

        this.productos = d.productos;
        if (this.id_pregunta_editar != "nuevo") {
          this.editar = true;
          this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(p => {
            if (p.success) {

              this.pregunta = p.pregunta[0];
              if (p.pregunta[0].keywords != null && p.pregunta[0].keywords != '') {
                this.pregunta.keywords = p.pregunta[0].keywords.split(',');
              } else {
                this.pregunta.keywords = [];
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
                              this.crearTablaPreguntasAdicion(this.preguntas_adicion);
                              this.ajax.get('preguntas/obtener-cargos-asociados', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(carg => {
                                if (carg.success) {
                                  this.cargos_asociados = carg.cargos_asociados;
                                  this.crearTablaCargosAdicion(this.cargos_asociados);
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

    this.ajax.get('estado-pregunta/obtener-flujos', {}).subscribe(d => {
      if (d.success) {
        this.estado_flujo_pregunta = d.estados_flujo_pregunta;
        this.cg.detectChanges();
      }
    })
  }

  crearTablaPreguntasAdicion(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  crearTablaCargosAdicion(data) {
    this.dataSource2 = new MatTableDataSource(data);
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
    this.dataSource2.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  guardarPregunta() {
    // console.log(this.pregunta);
    if (this.pregunta.titulo == "" || this.pregunta.id_producto == "" || this.pregunta.id_estado == "" || !this.pregunta.id_producto) {

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
      this.loading = true;
      if (this.editar) {
        if (this.pregunta.muestra_fecha_actualizacion) {
          this.pregunta.muestra_fecha_actualizacion = 1;
        } else {
          this.pregunta.muestra_fecha_actualizacion = 0;
        }
        this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;

        for (let i = 0; i < this.array_mostrar.length; i++) {
          this.array_mostrar[i].pos_segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
        }
        
        this.ajax.post('preguntas/editar', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar, preguntas_adicion: this.preguntas_adicion, cargos_asociados: this.cargos_asociados }).subscribe(d => {
          if (d.success) {
            this.router.navigate(['/admin/preguntas']);
          }
        })
      } else {
        this.loading = true;
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
            this.router.navigate(['/admin/preguntas']);
          }
        })
      }

    }

  }

  anadirSegmento() {
    this.segmentos.push({ titulo: '', respuesta: '' });
  }

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

  anadirSubRespuestaSegmento(e, pos) {
    this.array_mostrar.push({ titulo: '', respuesta: '', pos_segmento: pos, segmento: '' });
    
    if(e.idtbl_segmento){
      this.array_mostrar[this.array_mostrar.length - 1].segmento = e.idtbl_segmento;
    }

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

      this.crearTablaPreguntasAdicion(this.preguntas_adicion);

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


  anadirCargoAsociado(e) {
    let validador = true;
    for (let i = 0; i < this.cargos_asociados.length; i++) {
      if (this.cargos_asociados[i].idtbl_perfil == e.idtbl_perfil) {
        validador = false;
      }
    }

    if (validador) {
      this.cargos_asociados.push(e);

      this.crearTablaCargosAdicion(this.cargos_asociados);

      this.cg.detectChanges();
    } else {

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
    this.myControl2.setValue('');

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
                this.crearTablaPreguntasAdicion(this.preguntas_adicion);
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
            this.crearTablaPreguntasAdicion(this.preguntas_adicion);
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
          this.crearTablaPreguntasAdicion(this.preguntas_adicion);
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
                this.crearTablaCargosAdicion(this.cargos_asociados);
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
            this.crearTablaCargosAdicion(this.cargos_asociados);
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
          this.crearTablaCargosAdicion(this.cargos_asociados);
          this.cg.detectChanges();
        }
      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilter2(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource2.filter = filterValue;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const length_keywords = this.pregunta.keywords.length;
    
    if ((value || '').trim()) {
      if (length_keywords <= 99) {
        this.pregunta.keywords.push(value.trim());
      } else {
        swal.fire({
          title: 'Advertencia',
          text: "El límite de palabras clave permitidas por pregunta es 100",
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'custom-sweet'
          }
        });
      }
    }
    if (input) {
      input.value = '';
    }
  }

  remove(keyword: any): void {
    const index = this.pregunta.keywords.indexOf(keyword);
    if (index >= 0) {
      this.pregunta.keywords.splice(index, 1);
    }
  }

}
