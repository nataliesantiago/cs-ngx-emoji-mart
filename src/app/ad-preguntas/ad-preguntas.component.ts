import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { AjaxService } from '../../providers/ajax.service';
import { UserService } from '../../providers/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-ad-preguntas',
  templateUrl: './ad-preguntas.component.html',
  styleUrls: ['./ad-preguntas.component.css']
})
export class AdPreguntasComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns = ['id', 'pregunta', 'id_producto', 'id_estado', 'acciones'];
  dataSource = new MatTableDataSource([]);
  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: 3, id_estado_flujo: 4 };
  usuario;
  id_usuario;
  data = [];
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
    this.ajax.get('preguntas/obtener', {}).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.preguntas);
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
    })
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  

}

