import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { FiltrosService } from '../providers/filtros.service';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  styleUrls: ['./historial-usuario.component.scss']
})
export class HistorialUsuarioComponent implements OnInit {

  displayedColumns = ['texto_busqueda', 'tipo_busqueda', 'fecha_busqueda', 'url'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'texto_busqueda', type: 'string' },
    { field: 'tipo_busqueda', type: 'string' },
    { field: 'fecha_busqueda', type: 'string' },
    { field: 'url', type: 'string' }
  ];
  user;
  busquedas: any;
  tipos_busqueda;
  filters = {};
  filter_value;
  selected_value;

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, 
              private cg: ChangeDetectorRef, private qs: QuillService, private filtros_service: FiltrosService) {

    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });
  }


  ngOnInit() {

    this.userService.obtenerHistorialBusquedas(this.user.idtbl_usuario).then(p => {
      this.busquedas = p;
      this.createTable(this.busquedas);
    });

    this.filtros_service.getSearchType().then(result => {
      this.tipos_busqueda = result;
    });
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.filter_value = filterValue;
    if (this.selected_value != undefined && this.selected_value.value != 'todos') {
      this.filterData('tipo_busqueda', this.selected_value);
    }
  }

  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.busquedas);
      this.filter_value = '';
    } else {
      this.filters[name] = event.value;
      let newArray = this.busquedas;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          if (this.filter_value == '' || this.filter_value == undefined) {
            return element[key] == this.filters[key];
          } else {
            return element[key] == this.filters[key] && element.texto_busqueda.indexOf(this.filter_value) !== -1;
          }
        });
      }
      this.createTable(newArray);
    }
    this.selected_value = event;
  }

}
