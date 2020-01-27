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
  cant_curaduria;
  cant_revision;
  cant_aprobacion;
  cant_aprobados;
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
  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef, private filtros_service: FiltrosService, private dialog: MatDialog, private route: ActivatedRoute, private searchService: SearchService) {

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
      // console.log(a);
      if (a.vista != this.vista) {
        //console.log('se movio')
        this.filtro_tabla = (a.filter && a.filter != 'undefined') ? a.filter : '';
        switch (a.vista) {
          case 'curaduria':
            this.cargarCuraduria(a.filter);
            break;
          case 'revision':
            this.cargarRevision(a.filter);
            break;
          case 'aprobacion':
            this.cargarAprobacion(a.filter);
            break;
          case 'aprobados':
            this.cargarAprobados(a.filter);
            break;

          default:
            //this.cargarCuraduria(a.filter);
            break;
        }


      } else if (!a.vista) {
        this.cargarCuraduria(a.filter);
      }
    });


  }

  cambiarPestana(vista) {
    let f = (this.filtro_tabla) ? this.filtro_tabla : '';
    this.cambiarUrl(vista + '&&filter=' + encodeURI(f));
  }

  cargarCuraduria(filter) {
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
      // console.log('aqui')
      this.data = this.curaduria_reg;
      this.createTable(this.data);
      setTimeout(() => {
        this.applyFilter(filter);
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
        this.applyFilter(filter);
      }, 1);
    }

  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    this.cg.detectChanges();
  }

  cargarRevision(filter) {
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

        this.applyFilter(filter);
      }, 1);
    } else{

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



  cargarAprobacion(filter) {
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

        this.applyFilter();
      }, 1);
    } else{

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

  cargarAprobados(filter) {
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

        this.applyFilter();
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

  }

  cargarPreguntas(inicio, limite, actual, total) {
    let cantidad = (inicio + 1) * limite;
    if (cantidad <= total) {
      this.searchService.obtenerPreguntas(limite, inicio).then(preguntas => {
        //console.log(preguntas.length);
        preguntas = preguntas.filter(p => {
          return p.id_estado;
        })
        this.curaduria_reg = this.curaduria_reg.concat(preguntas.filter(p => {
          if (this.rol_usuario == 5) {
            return p.id_estado_flujo == 1 && p.id_usuario_revision == this.id_usuario;
          } else {
            return p.id_estado_flujo == 1;
          }
        }));
        this.revision_reg = this.revision_reg.concat(preguntas.filter(p => {
          return p.id_estado_flujo == 2;
        }));
        this.aprobar_reg = this.aprobar_reg.concat(preguntas.filter(p => {
          return p.id_estado_flujo == 3;
        }));
        this.aprobado_reg = this.aprobado_reg.concat(preguntas.filter(p => {
          return p.id_estado_flujo == 4;
        }));

      });
      let proxima = inicio + 1;
      this.cargarPreguntas(proxima, limite, actual, total);
    } else {
      this.searchService.obtenerPreguntas(limite, inicio).then(preguntas => {
        //console.log(preguntas.length);
        preguntas = preguntas.filter(p => {
          return p.id_estado;
        })
        this.curaduria_reg = this.curaduria_reg.concat(preguntas.filter(p => {
          if (this.rol_usuario == 5) {
            return p.id_estado_flujo == 1 && p.id_usuario_revision == this.id_usuario;
          } else {
            return p.id_estado_flujo == 1;
          }
        }));
        this.revision_reg = this.revision_reg.concat(preguntas.filter(p => {
          return p.id_estado_flujo == 2;
        }));
        this.aprobar_reg = this.aprobar_reg.concat(preguntas.filter(p => {
          return p.id_estado_flujo == 3;
        }));
        this.aprobado_reg = this.aprobado_reg.concat(preguntas.filter(p => {
          return p.id_estado_flujo == 4;
        }));
        let canti = inicio + 1;
        cantidad = (canti + 1) * limite;
        if (cantidad >= total) {
          //console.log(this.curaduria_reg.length);
          //console.log('paso por aca');
          this.cargando_preguntas = false;
          switch (this.vista) {
            case 'curaduria':
              this.cargarCuraduria(this.filtro_tabla);
              break;
            case 'revision':
              this.cargarRevision(this.filtro_tabla);
              break;
            case 'aprobacion':
              this.cargarAprobacion(this.filtro_tabla);
              break;
            case 'aprobados':
              this.cargarAprobados(this.filtro_tabla);
              break;

            default:
              this.cargarCuraduria(this.filtro_tabla);
              break;
          }
        }
      });
    }
  }

  init() {

    this.searchService.totalPreguntas().then(total => {
      let inicio = 0;
      let limite = 1000;
      let actual = 0;
      this.cargarPreguntas(inicio, limite, actual, total);
    })


    if (this.rol_usuario == 5) {
      this.ajax.get('preguntas/obtener-cantidad-preguntas-flujo-curaduria-persona', { estado_flujo_pregunta: 1, id_usuario: this.id_usuario }).subscribe(p => {
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

  applyFilter(filterValuees?: string) {
    if (!this.filtro_tabla) {
      this.filtro_tabla = filterValuees;
    }
    if (this.filtro_tabla) {
      this.cambiarUrl(this.vista + '&&filter=' + encodeURI(this.filtro_tabla.trim()));
      let filterValue = this.filtro_tabla.trim(); // Remove whitespace
      filterValue = this.filtro_tabla.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    } else {
      this.cambiarUrl(this.vista + '&&filter=');
      this.dataSource.filter = '';
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
