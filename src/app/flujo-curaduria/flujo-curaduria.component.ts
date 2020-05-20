import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import Swal from 'sweetalert2';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
import { matTableFilter } from '../../common/matTableFilter';
import { HistorialCuraduriaComponent } from '../components/historial-curaduria/historial-curaduria.component';
import { MatDialog } from '@angular/material';
import { FiltrosService } from '../providers/filtros.service';
import { Route } from '@angular/compiler/src/core';
import { environment } from '../../environments/environment';
import { SearchService } from '../providers/search.service';

@Component({
  selector: 'app-flujo-curaduria',
  templateUrl: './flujo-curaduria.component.html',
  styleUrls: ['./flujo-curaduria.component.scss']
})
export class FlujoCuraduriaComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns = ['acciones', 'idtbl_pregunta', 'titulo', 'nombre_producto', 'nombre_estado', 'nombre', 'nombre_usuario_creador', 'nombre_usuario_modificacion', 'fecha_ultima_modificacion'];
  matTableFilter: matTableFilter;
  cargando_preguntas = true;
  filterColumns = [
    { field: 'idtbl_pregunta', type: 'number' },
    { field: 'titulo', type: 'string' },
    { field: 'nombre_producto', type: 'string' },
    { field: 'nombre_estado', type: 'string' },
    { field: 'nombre', type: 'string' },
    { field: 'nombre_usuario_creador', type: 'string' },
    { field: 'nombre_usuario_modificacion', type: 'string' },
    { field: 'fecha_ultima_modificacion', type: 'date' }];
  dataSource = new MatTableDataSource([]);
  usuario;
  id_usuario;
  data;
  cant_curaduria = 0;
  cant_revision = 0;
  cant_aprobacion = 0;
  cant_aprobados = 0;
  activo_curaduria = true;
  activo_revision = false;
  activo_aprobacion = false;
  activo_aprobados = false;
  flujo_actual = "Preguntas en Curaduria";
  estados_pregunta;
  filters = {};
  rol_usuario;
  mostrar_accion = false;
  curaduria_reg = [];
  revision_reg = [];
  aprobar_reg = [];
  aprobado_reg = [];
  vista = '';
  filtro_tabla: string = '';
  ambiente = environment.ambiente;
  pagina = 0;
  limite = 1000;
  length = 0;
  temporal = [];
  progreso = 0;
  modo_spinner = 'determinate';
  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef, private filtros_service: FiltrosService, private dialog: MatDialog, private route: ActivatedRoute, private searchService: SearchService) {



  }

  cambiarPestana(vista) {
    let f = (this.filtro_tabla) ? this.filtro_tabla : '';
    this.cambiarUrl(vista + '&&filter=' + encodeURI(f));
  }

  cargarCuraduria(filter, primera) {
    this.vista = 'curaduria';
    //this.cambiarUrl(this.vista + '&&filter=' + this.filtro_tabla);
    this.flujo_actual = "Preguntas en Curaduria";
    this.activo_curaduria = true;
    this.activo_revision = false;
    this.activo_aprobacion = false;
    this.activo_aprobados = false;
    if (this.rol_usuario == 5) {
      this.mostrar_accion = true;
    } else {
      this.mostrar_accion = false;
    }
    if (this.curaduria_reg && this.curaduria_reg.length >= 0) {
      // // console.log('aqui')
      this.data = this.curaduria_reg;
      this.createTable(this.data);
      setTimeout(() => {
        this.applyFilter(filter, primera);
      }, 1);
    } else {
      /* if (this.rol_usuario == 5) {
         this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria-curaduria', { estado_flujo_pregunta: 1, id_usuario: this.id_usuario }).subscribe(p => {
           if (p.success) {
             this.curaduria_reg = p.preguntas;
             this.data = p.preguntas;
             this.createTable(this.data);
             setTimeout(() => {
               this.applyFilter(filter);
             }, 1);
 
           }
         })
       }
       this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', { estado_flujo_pregunta: 1 }).subscribe(p => {
         if (p.success) {
           this.curaduria_reg = p.preguntas;
           this.data = p.preguntas;
           this.createTable(this.data);
           setTimeout(() => {
             this.applyFilter(filter);
           }, 1);
 
         }
       })*/
      this.data = [];
      this.createTable(this.data);
      setTimeout(() => {
        this.applyFilter(filter, primera);
      }, 1);
    }

  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  cargarRevision(filter, primera) {
    this.vista = 'revision';
    //this.cambiarUrl(this.vista + '&&filter=' + this.filtro_tabla);
    this.flujo_actual = "Preguntas en Revisión";
    this.activo_curaduria = false;
    this.activo_revision = true;
    this.activo_aprobacion = false;
    this.activo_aprobados = false;
    if (this.rol_usuario == 7) {
      this.mostrar_accion = true;
    } else {
      this.mostrar_accion = false;
    }
    if (this.revision_reg && this.revision_reg.length >= 0) {
      this.data = this.revision_reg;
      this.createTable(this.data);
      setTimeout(() => {
        //


        this.applyFilter(filter, primera);
      }, 1);
    } else {

    }
    /*this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', { estado_flujo_pregunta: 2 }).subscribe(p => {
      if (p.success) {

        this.data = p.preguntas;
        this.revision_reg = p.preguntas;
        this.createTable(this.data);
        setTimeout(() => {

          this.applyFilter();
        }, 1);
      }
    })*/
  }

  cambiarUrl(parametro) {
    this.router.navigateByUrl('/flujo-curaduria?vista=' + encodeURI(parametro));
  }



  cargarAprobacion(filter, primera) {
    this.vista = 'aprobacion';
    //this.cambiarUrl(this.vista + '&&filter=' + this.filtro_tabla);
    this.flujo_actual = "Preguntas por Aprobar";
    this.activo_curaduria = false;
    this.activo_revision = false;
    this.activo_aprobacion = true;
    this.activo_aprobados = false;
    if (this.rol_usuario == 8 || (this.ambiente && this.ambiente == 'cam' && this.rol_usuario == 7)) {
      this.mostrar_accion = true;
    } else {
      this.mostrar_accion = false;
    }
    if (this.aprobar_reg && this.aprobar_reg.length >= 0) {
      this.data = this.aprobar_reg;
      this.createTable(this.data);
      setTimeout(() => {
        // 

        this.applyFilter(filter, primera);
      }, 1);
    } else {

    }
    /* this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', { estado_flujo_pregunta: 3 }).subscribe(p => {
       if (p.success) {
         this.aprobar_reg = p.preguntas;
         this.data = p.preguntas;
         this.createTable(this.data);
         setTimeout(() => {

           this.applyFilter();
         }, 1);
       }
     })*/
  }

  cargarAprobados(filter, primera) {
    this.vista = 'aprobados';
    //this.cambiarUrl(this.vista + '&&filter=' + this.filtro_tabla);
    this.flujo_actual = "Preguntas Aprobadas";
    this.activo_curaduria = false;
    this.activo_revision = false;
    this.activo_aprobacion = false;
    this.activo_aprobados = true;
    if (this.rol_usuario == 8 || this.rol_usuario == 7) {
      this.mostrar_accion = true;
    } else {
      this.mostrar_accion = false;
    }
    if (this.aprobado_reg && this.aprobado_reg.length >= 0) {
      this.data = this.aprobado_reg;
      this.createTable(this.data);
      setTimeout(() => {

        this.applyFilter(filter, primera);
      }, 1);
    } else { }
    /* this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', { estado_flujo_pregunta: 4 }).subscribe(p => {
       if (p.success) {
         this.aprobado_reg = p.preguntas;
         this.data = p.preguntas;
         this.createTable(this.data);
         setTimeout(() => {

           this.applyFilter();
         }, 1);
       }
     })*/
  }

  ngOnInit() {

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
        this.init();
      }
    })
    if (this.rol_usuario == 5) {
      this.mostrar_accion = true;
    }

    // create the source
    this.route.queryParams.subscribe(a => {
      // // console.log(a);
      let primera = false;
      if (this.vista == '') {
        primera = true;
      }

      if (a.vista != this.vista) {
        //// console.log('se movio')
        this.filtro_tabla = decodeURI((a.filter && a.filter != 'undefined') ? a.filter : '');
        switch (a.vista) {
          case 'curaduria':
            this.cargarCuraduria(a.filter, primera);
            break;
          case 'revision':
            this.cargarRevision(a.filter, primera);
            break;
          case 'aprobacion':
            this.cargarAprobacion(a.filter, primera);
            break;
          case 'aprobados':
            this.cargarAprobados(a.filter, primera);
            break;

          default:
            //this.cargarCuraduria(a.filter);
            break;
        }


      } else if (!a.vista) {
        this.cargarCuraduria(a.filter, primera);
      }
    });
  }

  cargarPreguntas() {
    let peticiones = Math.ceil(this.length / this.limite);
    let paso = Math.ceil(100 / peticiones);
    for (let index = 0; index < peticiones; index++) {
      this.searchService.obtenerPreguntasFlujo(this.limite, index).then(preguntas => {
        this.progreso += paso;
        if (this.progreso > 100) {
          this.progreso = 100;
        }
        this.temporal = this.temporal.concat(preguntas);

        if (this.temporal.length >= this.length) {
          this.curaduria_reg = this.curaduria_reg.concat(this.temporal.filter(p => {
            if (this.rol_usuario == 5) {
              return p.id_estado_flujo == 1 && p.id_usuario_revision == this.id_usuario;
            } else {
              return p.id_estado_flujo == 1;
            }
          }));
          this.revision_reg = this.revision_reg.concat(this.temporal.filter(p => {
            return p.id_estado_flujo == 2;
          }));
          this.aprobar_reg = this.aprobar_reg.concat(this.temporal.filter(p => {
            return p.id_estado_flujo == 3;
          }));
          this.aprobado_reg = this.aprobado_reg.concat(this.temporal.filter(p => {
            return p.id_estado_flujo == 4;
          }));

          this.cargando_preguntas = false;
          let primera = true;
          switch (this.vista) {
            case 'curaduria':
              this.cargarCuraduria(this.filtro_tabla, primera);
              break;
            case 'revision':
              this.cargarRevision(this.filtro_tabla, primera);
              break;
            case 'aprobacion':
              this.cargarAprobacion(this.filtro_tabla, primera);
              break;
            case 'aprobados':
              this.cargarAprobados(this.filtro_tabla, primera);
              break;

            default:
              this.cargarCuraduria(this.filtro_tabla, primera);
              break;
          }
        }
      })
    }
  }

  init() {

    this.searchService.totalPreguntasFlujo().then(total => {
      setTimeout(() => {
        this.length = total;
        this.cargarPreguntas();
      }, 0);
    });

    if (this.rol_usuario == 5) {
      this.ajax.get('preguntas/obtener-cantidad-preguntas-flujo-curaduria-persona', { estado_flujo_pregunta: 1, id_usuario: this.id_usuario }).subscribe(p => {
        console.log(p);
        if (p.success) {

          this.cant_curaduria = p.cantidad;
          //this.data = p.preguntas;
          //this.createTable(this.data);
        }
      })
    } else {
      this.ajax.get('preguntas/obtener-cantidad-preguntas-flujo-curaduria', { estado_flujo_pregunta: 1 }).subscribe(p => {
        if (p.success) {

          this.cant_curaduria = p.cantidad;
          //this.data = p.preguntas;
          //this.createTable(this.data);
        }
      })
    }
    this.ajax.get('preguntas/obtener-cantidad-preguntas-flujo-curaduria', { estado_flujo_pregunta: 2 }).subscribe(p1 => {
      if (p1.success) {
        this.cant_revision = p1.cantidad;
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-cantidad-preguntas-flujo-curaduria', { estado_flujo_pregunta: 3 }).subscribe(p2 => {
      if (p2.success) {
        this.cant_aprobacion = p2.cantidad;
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-cantidad-preguntas-flujo-curaduria', { estado_flujo_pregunta: 4 }).subscribe(p3 => {
      if (p3.success) {
        this.cant_aprobados = p3.cantidad;
        this.cg.detectChanges();
      }
    })





    this.filtros_service.getQuestionStates().then(result => {
      this.estados_pregunta = result;
    });
  }

  previsualizar(e) {
    this.router.navigate(['/respuestas', e.idtbl_pregunta]);
  }

  comentarios(e) {
    this.dialog.open(HistorialCuraduriaComponent, { height: '90%', width: '560px', data: { pregunta: e } }).afterClosed().subscribe(d => {

    });

  }

  cambiarEstado(e) {
    this.router.navigate(['/formulario-preguntas-flujo-curaduria', e.idtbl_pregunta]);
  }

  applyFilter(filterValuees?: string, primera?: boolean) {
    if (!this.filtro_tabla) {
      this.filtro_tabla = filterValuees;
    }

    if (this.filtro_tabla) {
      this.filtro_tabla = decodeURI(this.filtro_tabla);
      if (!primera) {
        // console.log('algo')
        this.cambiarUrl(this.vista + '&&filter=' + encodeURI(this.filtro_tabla.trim()));
      }
      let filterValue = this.filtro_tabla.trim(); // Remove whitespace
      filterValue = this.filtro_tabla.toLowerCase(); // Datasource defaults to lowercase matches
      setTimeout(() => {
        this.dataSource.filter = filterValue;
      }, 0);

    } else {
      if (!primera) {
        // console.log('algo')
        this.cambiarUrl(this.vista + '&&filter=');
      }
      setTimeout(() => {
        this.dataSource.filter = '';
      }, 0);


    }
  }

  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.data);
    } else {
      this.filters[name] = event.value;
      let newArray = this.data;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}
