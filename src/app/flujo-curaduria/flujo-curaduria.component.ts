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
  displayedColumns = ['id', 'pregunta', 'id_producto', 'id_estado', 'fecha_modificacion', 'acciones'];
  dataSource = new MatTableDataSource([]);
  usuario;
  id_usuario;
  data;
  cant_curaduria;
  cant_revision;
  cant_aprobacion;
  cant_aprobados;

  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef) { 
    this.usuario = user.getUsuario();
    console.log(this.usuario);
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        console.log("funciona");
        console.log(d.usuario[0].idtbl_usuario);
        this.id_usuario = d.usuario[0].idtbl_usuario;
      }
    })
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.preguntas);
        this.cant_curaduria = p.preguntas.length;
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 2}).subscribe(p1 => {
          if(p1.success){
            this.cant_revision = p1.preguntas.length;
            this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 3}).subscribe(p2 => {
              if(p2.success){
                this.cant_aprobacion = p2.preguntas.length;
                this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 4}).subscribe(p3 => {
                  if(p3.success){
                    this.cant_aprobados = p3.preguntas.length;
                  }
                })
              }
            })
          }
        })
      }
    })
     // create the source
    
  }

  cargarCuraduria(){
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 1}).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.preguntas);
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  cargarRevision(){
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 2}).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.preguntas);
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  cargarAprobacion(){
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 3}).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.preguntas);
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  cargarAprobados(){
    this.ajax.get('preguntas/obtener-preguntas-flujo-curaduria', {estado_flujo_pregunta: 4}).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.preguntas);
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  ngOnInit() {
  
  }

  async cambiarEstado(e){
    this.router.navigate(['/formulario-preguntas-flujo-curaduria'], {queryParams: {id_pregunta: e.idtbl_pregunta}});
  }

  

}
