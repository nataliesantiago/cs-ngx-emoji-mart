import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { matTableFilter } from '../../common/matTableFilter';


@Component({
  selector: 'app-administrador-usuarios',
  templateUrl: './administrador-usuarios.component.html',
  styleUrls: ['./administrador-usuarios.component.scss']
})
export class AdministradorUsuariosComponent implements OnInit {

  user: User;
  id_usuario;
  usuarios;
  displayedColumns = ['acciones', 'idtbl_usuario', 'nombre', 'correo', 'rol', 'perfil', 'peso_chat'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter: matTableFilter;
  id_usuario_editar;
  modificarUsuario = false;
  perfiles;
  roles;
  checkAll = false;
  total_seleccionado = 0;
  peso_todos = 1;
  texto_boton = "Editar Varios";
  mostrar_acciones = false;
  filterColumns = [
    { field: 'idtbl_usuario', type: 'number' },
    { field: 'nombre', type: 'string' },
    { field: 'correo', type: 'string' },
    { field: 'nombre_rol', type: 'string' },
    { field: 'nombre_perfil', type: 'string' },
    { field: 'peso_chat', type: 'number' }
  ];

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.userService.getAllUsers().then(p => {
      this.usuarios = p;
      this.dataSource = new MatTableDataSource(this.usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    });

    this.userService.getPerfilesUsuario().then(p => {
      this.perfiles = p;
    })

    this.userService.getRolesUsuario().then(p => {
      this.roles = p;
    })

  }

  editarRegistro(e) {
    this.modificarUsuario = false;
    this.id_usuario_editar = e.idtbl_usuario;
    this.cg.detectChanges();
    this.modificarUsuario = true;
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  actualizarDatos() {
    this.modificarUsuario = false;
    this.userService.getAllUsers().then(p => {
      this.usuarios = p;
      this.dataSource = new MatTableDataSource(this.usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
      this.cg.detectChanges();
    });
  }

  selectAll(all) {
    if (this.checkAll) {
      this.usuarios.forEach(el => {
        el.check = true;
      });
      this.total_seleccionado = this.usuarios.length;
    } else {
      this.usuarios.forEach(el => {
        el.check = false;
      });
      this.total_seleccionado = 0;
    }

  }

  countSelected(state) {

    this.checkAll = false;

    if (this.usuarios) {

      let count = 0;
      this.usuarios.forEach(el => {
        if (el.check === true) {
          count += 1;
        }
      });

      if (count == this.usuarios.length) {
        this.checkAll = true;
      }

      this.total_seleccionado = count;
      this.cg.detectChanges();

    }
  }

  closeAll() {
    this.peso_todos = 1;
    this.checkAll = false;
    this.usuarios.forEach(el => {
      el.check = false;
    });
    this.total_seleccionado = 0;
  }

  enviarDato() {
    this.userService.enviarPesos(this.usuarios, this.peso_todos).then(r => {
      if (r.success) {
        this.closeAll();
        this.userService.getAllUsers().then(p => {
          this.usuarios = p;
          this.dataSource = new MatTableDataSource(this.usuarios);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
          this.cg.detectChanges();
        });
      }
    })
  }

  editarVarios(){
    if(!this.mostrar_acciones){
      this.displayedColumns = ['check', 'acciones', 'idtbl_usuario', 'nombre', 'correo', 'rol', 'perfil', 'peso_chat'];
      this.texto_boton = "Ocultar Acciones"
      this.mostrar_acciones = true;
    }else{
      this.displayedColumns = ['acciones', 'idtbl_usuario', 'nombre', 'correo', 'rol', 'perfil', 'peso_chat'];
      this.texto_boton = "Editar Varios"
      this.mostrar_acciones = false;
    }
    
  }

}
