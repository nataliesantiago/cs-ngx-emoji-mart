import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-creacion-productos',
  templateUrl: './creacion-productos.component.html',
  styleUrls: ['./creacion-productos.component.scss']
})
export class CreacionProductosComponent implements OnInit {

  usuario;
  id_usuario;
  productos = [];
  displayedColumns = ['id', 'nombre', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.usuario = user.getUsuario();
    
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        this.id_usuario = d.usuario[0].idtbl_usuario;        
      }
    });

    this.ajax.get('producto/obtener', {}).subscribe(p => {
      if(p.success){
        
        this.productos = p.productos;
        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;                              
      }
    })

   }

  ngOnInit() {
  }

  editarRegistro(e){
    this.router.navigate(['/formulario-productos'], {queryParams: {id_producto: e.idtbl_producto}});
  }

}
