import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NotificacionService } from '../providers/notificacion.service';
import { AjaxService } from '../providers/ajax.service';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { matTableFilter } from '../../common/matTableFilter';
import swal from 'sweetalert2';

@Component({
  selector: 'app-administrador-notificaciones',
  templateUrl: './administrador-notificaciones.component.html',
  styleUrls: ['./administrador-notificaciones.component.scss']
})
export class AdministradorNotificacionesComponent implements OnInit {

  user: User;
  id_usuario;
  usuarios = [];
  displayedColumns = ['acciones', 'idtbl_notificacion', 'titulo', 'fecha_publicacion', 'fecha_creacion', 'activo'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'idtbl_notificacion', type:'number'},
    {field: 'titulo', type:'string'},
    {field: 'activo', type:'string'}
  ];
  notificaciones;
  filters = {};

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService, private notificacionService: NotificacionService){
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.notificacionService.obtenerNotificacionesAdministracion().then( n => {
      this.notificaciones = n;
      this.createTable(n);
    });

  }

  cancelarNotificacion(e) {
    swal.fire({
      title: 'Cancelar Notificación',
      text: "Confirme para cancelar la notificación",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        this.notificacionService.cancelarNotificacion(e).then(() => {
          this.notificacionService.obtenerNotificacionesAdministracion().then( n => {
            this.notificaciones = n;
            this.createTable(n);
          });
        });
      }
    })
    
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cg.detectChanges();
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }  

  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.notificaciones);
    } else {
      this.filters[name] = event.value;
      let newArray = this.notificaciones;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }
  
}
