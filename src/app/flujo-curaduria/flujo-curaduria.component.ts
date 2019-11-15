import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
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
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'idtbl_pregunta', type:'number'},
    {field: 'titulo', type:'string'},
    {field: 'nombre_producto', type:'string'},
    {field: 'nombre_estado', type:'string'},
    {field: 'nombre', type:'string'},
    {field: 'nombre_usuario_creador', type:'string'},
    {field: 'nombre_usuario_modificacion', type:'string'},
    {field: 'fecha_ultima_modificacion', type:'date'}];
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

  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef, private filtros_service: FiltrosService, private dialog: MatDialog) { 

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

    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        this.cant_curaduria = p.preguntas.length;
        this.data = p.preguntas;
        //this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
        this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 2}).subscribe(p1 => {
      if(p1.success){
        this.cant_revision = p1.preguntas.length;            
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 3}).subscribe(p2 => {
      if(p2.success){
        this.cant_aprobacion = p2.preguntas.length;            
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 4}).subscribe(p3 => {
      if(p3.success){
        this.cant_aprobados = p3.preguntas.length;
        this.cg.detectChanges();
      }
    })
     // create the source
    
  }

  cargarCuraduria(){
    this.flujo_actual = "Preguntas en Curaduria";
    this.activo_curaduria = true;
    this.activo_revision = false;
    this.activo_aprobacion = false;
    this.activo_aprobados = false;
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        
        this.data = p.preguntas;
        this.createTable(this.data);
      }
    })
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
    this.cg.detectChanges();
  }

  cargarRevision(){
    this.flujo_actual = "Preguntas en Revisión";
    this.activo_curaduria = false;
    this.activo_revision = true;
    this.activo_aprobacion = false;
    this.activo_aprobados = false;
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 2}).subscribe(p => {
      if(p.success){
        
        this.data = p.preguntas;
        this.createTable(this.data);
      }
    })
  }

  cargarAprobacion(){
    this.flujo_actual = "Preguntas por Aprobar";
    this.activo_curaduria = false;
    this.activo_revision = false;
    this.activo_aprobacion = true;
    this.activo_aprobados = false;
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 3}).subscribe(p => {
      if(p.success){
        
        this.data = p.preguntas;
        this.createTable(this.data);
      }
    })
  }

  cargarAprobados(){
    this.flujo_actual = "Preguntas Aprobadas";
    this.activo_curaduria = false;
    this.activo_revision = false;
    this.activo_aprobacion = false;
    this.activo_aprobados = true;
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 4}).subscribe(p => {
      if(p.success){
        
        this.data = p.preguntas;
        this.createTable(this.data);
      }
    })
  }

  ngOnInit() {
    
  }

  init(){

    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        
        this.cant_curaduria = p.preguntas.length;
        this.data = p.preguntas;
        this.createTable(this.data);
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 2}).subscribe(p1 => {
      if(p1.success){
        this.cant_revision = p1.preguntas.length;            
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 3}).subscribe(p2 => {
      if(p2.success){
        this.cant_aprobacion = p2.preguntas.length;            
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 4}).subscribe(p3 => {
      if(p3.success){
        this.cant_aprobados = p3.preguntas.length;
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

  comentarios(e){
    this.dialog.open(HistorialCuraduriaComponent).afterClosed().subscribe(d => {

    });
    /*
    let notas = {};

    this.ajax.get('preguntas/obtener-comentarios-pregunta', {idtbl_pregunta: e.idtbl_pregunta}).subscribe(async p => {
      if(p.success){
        
        for(let i = 0; i < p.comentarios.length; i++){
          p.comentarios[i].fecha = moment(p.comentarios[i].fecha).tz('America/Bogota').format('YYYY-MM-DD HH:mm');
        }
        let comentarios = '<div style="height: 250px; overflow-x: hidden;">';
        
        for(let i = 0; i < p.comentarios.length; i++){
          comentarios += '<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; padding: 2px 16px; width: 95%; margin-left: 2%;"><h3><strong>' + p.comentarios[i].nombre_usuario + ' ' + p.comentarios[i].fecha + '</strong></h3>';
          comentarios += '<h6>' + p.comentarios[i].notas + '</strong></h6></div><br>';
        }

        comentarios += '</div>';

        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputPlaceholder: 'Nuevo Comentario',
          inputAttributes: {
            'aria-label': 'Nuevo Comentario'
          },
          html: comentarios,
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
          confirmButtonText: 'Aceptar',
          cancelButtonClass: 'custom__btn custom__btn--cancel',
          cancelButtonText: 'Cancelar',
          customClass: {
            container: 'custom-sweet'
          }
        })
        
        if (text) {
          notas = {notas: text, id_estado: e.id_estado, id_estado_flujo: e.id_estado_flujo, idtbl_pregunta: e.idtbl_pregunta, id_usuario: this.id_usuario}
          this.ajax.post('preguntas/guardar-nota-curaduria', {nota: notas}).subscribe(p => {
            if(p.success){
              
            }
          })
        }
      }
    })
   */ 
  }

  cambiarEstado(e){
    this.router.navigate(['/formulario-preguntas-flujo-curaduria', e.idtbl_pregunta]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
