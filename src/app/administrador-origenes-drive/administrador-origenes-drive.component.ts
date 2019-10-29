import { Component, OnInit, ViewChild } from '@angular/core';
import { OrigenDrive } from '../../schemas/interfaces';
import { User } from '../../schemas/user.schema';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';
import { UserService } from '../providers/user.service';
import { SearchService } from '../providers/search.service';
import swal from 'sweetalert2';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-administrador-origenes-drive',
  templateUrl: './administrador-origenes-drive.component.html',
  styleUrls: ['./administrador-origenes-drive.component.scss']
})
export class AdministradorOrigenesDriveComponent implements OnInit {
  creando_origen = false;
  nuevo_origen: OrigenDrive = {};
  user: User;
  creando_extension = false;
  displayedColumns = ['acciones', 'nombre', 'id_carpeta', 'estado'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'nombre', type: 'string' }];
  origenes = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  urlControl = new FormControl(null, [Validators.required, this.validaUrlDriveControl()]);
  constructor(private userService: UserService, private searchService: SearchService) {
    this.user = this.userService.getUsuario();

    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      } else {
        delete this.user;
      }
    });
  }

  ngOnInit() {
  }
  init() {
    this.nuevo_origen = {};
    this.urlControl.reset();
    this.creando_origen = false;
    this.searchService.buscarOrigenesDrive().then((origenes: Array<OrigenDrive>) => {
      this.origenes = origenes;
      this.origenes.forEach(o => {
        o.nombre_temporal = o.nombre;
      });
      this.dataSource = new MatTableDataSource(this.origenes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    })
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  crearOrigen() {
    this.nuevo_origen.id_usuario_creador = this.user.getId();
    let tmp = this.nuevo_origen.url.split('/');
    this.nuevo_origen.id_carpeta = tmp[tmp.length - 1];
    this.nuevo_origen.token_usuario = this.user.token_acceso;
    this.searchService.crearOrigenDrive(this.nuevo_origen).then(() => {
      this.init();
    })
  }

  validaUrlDrive() {

    if (this.nuevo_origen && this.nuevo_origen.url) {
      let tmp = this.nuevo_origen.url.split('/');
      let id_carpeta = tmp[tmp.length - 1];
      let f = this.origenes.find((o: OrigenDrive) => {
        return o.id_carpeta == id_carpeta;
      });
      if (f) {
        return false;
      } else if (this.nuevo_origen.url.indexOf('https://drive.google.com/drive/') == 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // https://drive.google.com/drive/folders/17LTVYMsrDYzIZmxBkDVQnj_LpTWIsTv7
  }
  validaUrlDriveControl(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let url = control.value;
      if (this.nuevo_origen && this.nuevo_origen.url) {
        let tmp = url.split('/');
        let id_carpeta = tmp[tmp.length - 1];
        let f = this.origenes.find((o: OrigenDrive) => {
          return o.id_carpeta == id_carpeta;
        });
        if (f) {
          return { 'urlInvalida': { value: control.value } };
        } else if (url.indexOf('https://drive.google.com/drive/') == 0) {
          return null;
        } else {
          return { 'urlInvalida': { value: control.value } };
        }
      } else {
        return { 'urlInvalida': { value: control.value } };
      }
    };

    // https://drive.google.com/drive/folders/17LTVYMsrDYzIZmxBkDVQnj_LpTWIsTv7
  }

  eliminarOrigen(e: OrigenDrive) {
    swal.fire({
      title: 'Cuidado',
      text: "Desea desactivar el origen de Drive?",
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
        e.activo = false;
        this.searchService.editarOrigenDrive(e).then(() => {
          this.init();
        });
      }
    });
  }
  activarOrigen(e: OrigenDrive) {
    swal.fire({
      title: 'Cuidado',
      text: "Desea activar el origen de Drive?",
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
        e.activo = true;
        this.searchService.editarOrigenDrive(e).then(() => {
          this.init();
        });
      }
    });
  }

  editarOrigen(e: OrigenDrive) {
    e.nombre = e.nombre_temporal;
    this.searchService.editarOrigenDrive(e).then(() => {
      this.init();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
}
