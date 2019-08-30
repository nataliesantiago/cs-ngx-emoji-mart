import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {

  items_administracion = [];
  displayedColumns = ['acciones', 'id', 'nombre', 'valor'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  id_usuario;
  usuario;
  editar = true;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService){

    this.ajax.get('administracion/obtener', {}).subscribe(p => {
      if(p.success){
        
        this.items_administracion = p.items;
        
        this.dataSource = new MatTableDataSource(this.items_administracion);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;                              
      }
    })
    this.usuario = user.getUsuario();
    
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        
        this.id_usuario = d.usuario[0].idtbl_usuario;        
      }
    });

  }

  ngOnInit() {
    
  }

  editarRegistro(u) {
    u.editando = true;
    this.cg.detectChanges();
  }

  cancelarEdicion(u){
    u.editando = false;
  }

  guardarRegistro(u){
    u.usuario_modificacion = this.id_usuario;
    swal.fire({
      title: 'Guardar cambios',
      text: "Confirme para guardar los cambios",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar'
    }).then((result) => {
      if (result.value) {
        this.ajax.post('administracion/editar', { item: u }).subscribe(d => {
          if(d.success){
            
            u.editando = false;
            swal.fire(  
              'Se guardó el registro correctamente.',
            )    
          }
        })
        
      }
    })
  }

}
