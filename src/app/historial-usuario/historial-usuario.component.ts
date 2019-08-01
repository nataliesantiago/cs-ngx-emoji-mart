import { Component, ViewChild, OnInit } from '@angular/core';
import { ResponseSearch } from '../models/response-search';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  styleUrls: ['./historial-usuario.component.scss']
})
export class HistorialUsuarioComponent implements OnInit {

  data: any;
  displayedColumns = ['fecha', 'busqueda', 'tipoBusqueda', 'url'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  constructor(
    private responseSearch: ResponseSearch,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['fecha', 'busqueda', 'tipoBusqueda', 'url'] :
        ['fecha', 'busqueda', 'tipoBusqueda', 'url'];
    });

    this.data = this.responseSearch._historial.map(data => {
      data.busqueda = data.busqueda.toLowerCase();
      data.tipoBusqueda = data.tipoBusqueda.toLowerCase();
      data.url = data.url.toLowerCase();
      return data;
    });
    console.log(this.data);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  sortData(event) {
    this.data = this.data.sort((a, b) => {
      const fecha1 = new Date(a.fecha).valueOf();
      const fecha2 = new Date(a.fecha).valueOf();
      return fecha1 > fecha2 ? 1 : -1;
    });
  }

}
