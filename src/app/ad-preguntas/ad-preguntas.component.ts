import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { RouterModule, Router } from '@angular/router';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
import { FiltrosService } from '../providers/filtros.service';
import { SearchService } from '../providers/search.service';
import { UtilsService } from '../providers/utils.service';

@Component({
  selector: 'app-ad-preguntas',
  templateUrl: './ad-preguntas.component.html',
  styleUrls: ['./ad-preguntas.component.scss']
})
export class AdPreguntasComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns = ['acciones', 'idtbl_pregunta', 'titulo', 'nombre_producto', 'nombre_estado_flujo', 'nombre_estado', 'muestra_fecha_actualizacion'];
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'idtbl_pregunta', type: 'number' },
    { field: 'titulo', type: 'string' },
    { field: 'nombre_producto', type: 'string' },
    { field: 'nombre_estado', type: 'string' },
    { field: 'nombre_estado_flujo', type: 'string' },
    { field: 'muestra_fecha_actualizacion', type: 'boolean', values: { "1": "Si", "0": "No" } }];
  dataSource = new MatTableDataSource([]);
  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: 3, id_estado_flujo: 4 };
  usuario;
  id_usuario;
  data = [];
  temporal = [];
  mostrar_fecha_ultima_modificacion = false;
  estados_pregunta;
  filters = {};
  pagina = 0;
  limite = 500;
  length = 0;
  setData = new Set();
  cargando_preguntas = true;
  progreso = 0;
  modo_spinner = 'determinate';
  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef, private filtros_service: FiltrosService, private searchService: SearchService, private utilsService: UtilsService) {

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
    /*
        this.ajax.get('preguntas/obtener', {}).subscribe(p => {
          // console.log(p);
          if (p.success) {
            // console.log(p.preguntas);
            this.data = p.preguntas;
            this.createTable(this.data);
          }
        })*/
    // create the source
    this.filtros_service.getQuestionStates().then(result => {
      this.estados_pregunta = result;
    });
  }

  init() {

    this.cargarPreguntas();

  }

  cargarPreguntas() {
    this.searchService.totalPreguntas().then(t => {
      setTimeout(() => {
        this.length = t;
        this.paginator.length = t;
        this.fillPreguntas();
      }, 0);

    });

  }

  fillPreguntas() {
    let peticiones = Math.ceil(this.length / this.limite);
    let paso = Math.ceil(100 / peticiones);
    for (let index = 0; index < peticiones; index++) {
      this.searchService.obtenerPreguntas(this.limite, index).then(preguntas => {
        //// console.log(preguntas);
        this.progreso += paso;
        if (this.progreso > 100) {
          this.progreso = 100;
        }
        this.temporal = this.temporal.concat(preguntas);
        if (this.temporal.length >= this.length) {
          //this.pagina++;
          //this.fillPreguntas();
          this.cargando_preguntas = false;
          this.data = this.utilsService.getUnique(this.temporal, 'idtbl_pregunta');
          this.createTable(this.data);
        }
        /*this.setData = new Set(this.data);
        // console.log(this.setData.size);
        this.data = Array.from(this.setData);*/

        // // console.log(this.data);


      })

    }

  }

  cambiaSize(e: Event) {
    //// console.log(e);
  }

  ngOnInit() {
    this.paginator.page.subscribe((p: PageEvent) => {
      //// console.log(p);
      let index = p.pageIndex + 1;
      let cant = index * p.pageSize;
      //// console.log(cant);
      if (cant > this.data.length) {
        this.limite = p.pageSize;
        this.pagina = index;
        this.cargarPreguntas();
      }
    })
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
  }

  editarElemento(e) {
    this.router.navigate(['/formulario_pregunta', e.idtbl_pregunta]);
  }

  borrarElemento(e) {

    swal.fire({
      title: 'Eliminar Pregunta',
      text: "Confirme para pasar la pregunta a estado Inactivo",
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
        this.ajax.post('preguntas/eliminar', { pregunta: e, id_usuario: this.id_usuario }).subscribe(p => {
          if (p.success) {
            this.pagina = 0;
            this.paginator.pageIndex = 0;
            this.init();
          }
        })
      }
    })

  }

  asociarPreguntas(e) {
    this.router.navigate(['/asociar-preguntas'], { queryParams: { id_pregunta: e.idtbl_pregunta } });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  previsualizar(e) {
    this.router.navigate(['/respuestas', e.idtbl_pregunta]);
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

