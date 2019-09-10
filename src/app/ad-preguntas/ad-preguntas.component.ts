import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
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
  displayedColumns = ['acciones', 'id', 'pregunta', 'id_producto', 'id_estado', 'fecha_modificacion'];
  dataSource = new MatTableDataSource([]);
  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: 3, id_estado_flujo: 4 };
  usuario;
  id_usuario;
  data = [];
  mostrar_fecha_ultima_modificacion = false;
  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef) { 
    this.usuario = user.getUsuario();
    
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        
        this.id_usuario = d.usuario[0].idtbl_usuario;
      }
    })
    this.ajax.get('preguntas/obtener', {}).subscribe(p => {
      if(p.success){
        
        this.data = p.preguntas;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
     // create the source
    
  }

  ngOnInit() {
    
  }

  editarElemento(e){
    this.router.navigate(['/formulario_pregunta'], {queryParams: {id_pregunta: e.idtbl_pregunta}});
  }

  borrarElemento(e){
    this.ajax.post('preguntas/eliminar', { pregunta: e, id_usuario: this.id_usuario }).subscribe(p => {
      if(p.success){
        this.ajax.get('preguntas/obtener', {}).subscribe(p => {
          if(p.success){
            
            this.data = p.preguntas;
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.cg.detectChanges();
          }
        })
      }
    })
    
  }

  asociarPreguntas(e){
    this.router.navigate(['/asociar-preguntas'], {queryParams: {id_pregunta: e.idtbl_pregunta}});
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  previsualizar(e) {
    this.router.navigate(['/respuestas', e.idtbl_pregunta]);
  }
  

}

