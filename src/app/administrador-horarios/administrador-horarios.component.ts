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
  displayedColumns = ['acciones', 'idtbl_horario_chat', 'hora_inicio', 'hora_fin', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'activo'];
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
  filters = {};

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
      this.createTable(this.horarios);
    })
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    this.cg.detectChanges();
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
      this.createTable(this.horarios);
      u.editando = false;
    })
  }


  guardarRegistro(u) {
    u.usuario_modificacion = this.id_usuario;
    this.user.editarHorario(u).then(d => {
      this.user.obtenerHorarios().then(d => {
        this.horarios = d;
        this.createTable(this.horarios);
        this.creando_horario = false;
        u.editando = false;
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
        this.createTable(this.horarios);
        this.creando_horario = false;
        this.horario_nuevo = { hora_inicio: '', hora_fin: '', lunes: 0, martes: 0, miercoles: 0, jueves: 0, viernes: 0, sabado: 0, domingo: 0 };
      })
    })
  }

  activarHorario(u) {
    swal.fire({
      title: 'Activar Horario',
      text: "Confirme para activar el horario",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Activar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        u.usuario_modificacion = this.id_usuario;
        this.user.activarHorario(u).then(d => {
          this.user.obtenerHorarios().then(d => {
            this.horarios = d;
            this.createTable(this.horarios);
            this.creando_horario = false;
            u.editando = false;
          })
        })
      }
    })
  }


  desactivarHorario(u) {
    swal.fire({
      title: 'Desactivar Horario',
      text: "Confirme para desactivar el horario",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Desactivar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        u.usuario_modificacion = this.id_usuario;
        this.user.desactivarHorario(u).then(d => {
          this.user.obtenerHorarios().then(d => {
            this.horarios = d;
            this.createTable(this.horarios);
            this.creando_horario = false;
            u.editando = false;
          })
        })
      }
    })
  }

  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.horarios);
    } else {
      this.filters[name] = event.value;
      let newArray = this.horarios;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}
