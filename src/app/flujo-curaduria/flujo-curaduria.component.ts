import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RouterModule, Router } from '@angular/router';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import Swal from 'sweetalert2';


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
  displayedColumns = ['acciones', 'id', 'pregunta', 'id_producto', 'id_estado', 'encargado'];
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

  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef) { 
    this.usuario = user.getUsuario();
    
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        
        this.id_usuario = d.usuario[0].idtbl_usuario;
        this.cg.detectChanges();
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        
        this.cant_curaduria = p.preguntas.length;
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
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
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
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
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
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
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
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
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  ngOnInit() {

    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        
        this.cant_curaduria = p.preguntas.length;
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
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

  }

  previsualizar(e) {
    this.router.navigate(['/respuestas'], {queryParams: {id_pregunta: e.idtbl_pregunta}});
  }

  async comentarios(e){

    let notas = {};

    this.ajax.get('preguntas/obtener-comentarios-pregunta', {idtbl_pregunta: e.idtbl_pregunta}).subscribe(async p => {
      if(p.success){
        

        let comentarios = '<div style="height: 250px; overflow-x: hidden;">';
        
        for(let i = 0; i < p.comentarios.length; i++){
          comentarios += '<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; padding: 2px 16px; width: 95%; margin-left: 2%;"><h3><strong>' + p.comentarios[i].nombre_usuario + '</strong></h3>';
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
          showCancelButton: true
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
    
  }

  cambiarEstado(e){
    this.router.navigate(['/formulario-preguntas-flujo-curaduria'], {queryParams: {id_pregunta: e.idtbl_pregunta}});
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
