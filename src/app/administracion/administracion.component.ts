import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {

  items_administracion = [];
  displayedColumns = ['acciones', 'idtbl_configuracion', 'nombre', 'valor'];
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'idtbl_configuracion', type: 'number' },
    { field: 'nombre', type: 'string' },
    { field: 'valor', type: 'string' }];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  id_usuario;
  usuario;
  editar = true;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {



    this.usuario = this.user.getUsuario();
    // // console.log(this.usuario);
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

  }
  init() {
    this.ajax.get('administracion/obtener', {}).subscribe(p => {
      if (p.success) {

        this.items_administracion = p.items;

        this.dataSource = new MatTableDataSource(this.items_administracion);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
      }
    })
  }
  ngOnInit() {

  }

  editarRegistro(u) {
    u.editando = true;
    this.cg.detectChanges();
  }

  cancelarEdicion(u) {
    this.ajax.get('administracion/obtener', {}).subscribe(p => {
      if (p.success) {

        this.items_administracion = p.items;

        this.dataSource = new MatTableDataSource(this.items_administracion);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
        this.cg.detectChanges();
        u.editando = false;
      }
    })
  }

  guardarRegistro(u) {
    u.usuario_modificacion = this.id_usuario;
    this.ajax.post('administracion/editar', { item: u }).subscribe(d => {
      if (d.success) {
        u.editando = false;
      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
