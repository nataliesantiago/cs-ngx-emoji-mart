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
  displayedColumns = ['acciones', 'idtbl_usuario', 'nombre', 'correo'];
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
  filterColumns = [
    { field: 'idtbl_usuario', type: 'number' },
    { field: 'nombre', type: 'string' },
    { field: 'correo', type: 'string' }
  ];

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.userService.getAllUsers().then( p => {
      this.usuarios = p;
      this.dataSource = new MatTableDataSource(this.usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    });

    this.userService.getPerfilesUsuario().then( p => {
      this.perfiles = p;
    })

    this.userService.getRolesUsuario().then( p => {
      this.roles = p;
    })

  }

  editarRegistro(e) {
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

  actualizarDatos(){
    this.modificarUsuario = false;
    this.userService.getAllUsers().then( p => {
      this.usuarios = p;
      this.dataSource = new MatTableDataSource(this.usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
      this.cg.detectChanges();
    });
  }

}
