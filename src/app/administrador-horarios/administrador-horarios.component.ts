import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';


@Component({
  selector: 'app-administrador-horarios',
  templateUrl: './administrador-horarios.component.html',
  styleUrls: ['./administrador-horarios.component.scss']
})
export class AdministradorHorariosComponent implements OnInit {


  horarios: any;
  displayedColumns = ['acciones', 'idtbl_horario_chat', 'hora_inicio', 'hora_fin', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'idtbl_horario_chat', type: 'number' },
    { field: 'hora_inicio', type: 'string' },
    { field: 'hora_fin', type: 'string' }];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  id_usuario;
  usuario;
  editar = true;
  horario_nuevo = { hora_inicio: '', hora_fin: '', lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0, sabado: 0, domingo: 0 };
  creando_horario = false;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
      }
    })

    this.user.obtenerHorarios().then(d => {
      this.horarios = d;
      this.dataSource = new MatTableDataSource(this.horarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    })
  }

  ngOnInit() {
  }

  editarRegistro(u) {
    u.editando = true;
    this.cg.detectChanges();
  }

  cancelarEdicion(u) {
    this.user.obtenerHorarios().then(d => {
      this.horarios = d;
      this.dataSource = new MatTableDataSource(this.horarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
      this.cg.detectChanges();
      u.editando = false;
    })
  }


  guardarRegistro(u) {
    u.usuario_modificacion = this.id_usuario;
    this.user.editarHorario(u).then(d => {
      this.user.obtenerHorarios().then(d => {
        this.horarios = d;
        this.dataSource = new MatTableDataSource(this.horarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
        this.creando_horario = false;
        u.editando = false;
        this.cg.detectChanges();
      })
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  crearHorario() {
    this.user.crearHorario(this.horario_nuevo, this.id_usuario).then(d => {
      this.user.obtenerHorarios().then(d => {
        this.horarios = d;
        this.dataSource = new MatTableDataSource(this.horarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
        this.creando_horario = false;
        this.horario_nuevo = { hora_inicio: '', hora_fin: '', lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0, sabado: 0, domingo: 0 };
        this.cg.detectChanges();
      })
    })
  }

}
