import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-adminsitracion-roles',
  templateUrl: './adminsitracion-roles.component.html',
  styleUrls: ['./adminsitracion-roles.component.scss']
})
export class AdminsitracionRolesComponent implements OnInit {
  user: User;
  roles = [];
  perfiles = [];
  @ViewChild('paginador') paginator: MatPaginator;
  @ViewChild('paginadorp') paginatorp: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('sortp') sortp: MatSort;
  displayedColumns = ['nombre', 'sos'];
  dataSource: MatTableDataSource<any>;
  dataSourcep: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  constructor(private userService: UserService) {
    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u
        this.init();
      }
    });

  }

  init() {
    this.userService.getRolesAplicacion().then(data => {
      this.roles = data.roles;
      this.perfiles = data.perfiles;
      this.dataSource = new MatTableDataSource(this.roles);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          return (currentTerm + (data as { [key: string]: any })[key]);
        }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return dataStr.indexOf(transformedFilter) != -1;
      }

      this.dataSourcep = new MatTableDataSource(this.perfiles);
      this.dataSourcep.paginator = this.paginatorp;
      this.dataSourcep.sort = this.sortp;
      this.dataSourcep.filterPredicate = (data: any, filter: string): boolean => {
        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          return (currentTerm + (data as { [key: string]: any })[key]);
        }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return dataStr.indexOf(transformedFilter) != -1;
      }
      //this.matTableFilter = new matTableFilter(this.dataSource, this.roles);
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyFilterp(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSourcep.filter = filterValue;
  }

  ngOnInit() {
  }

  guardarRol(row) {
    this.userService.actualizarRol(row).then(() => {

    });
  }

  guardarPerfil(row) {
    this.userService.actualizarPerfil(row).then(() => {

    });
  }

}
