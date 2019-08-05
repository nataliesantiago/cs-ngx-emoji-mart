import { Component, ViewChild, OnInit } from '@angular/core';
import { ResponseSearch } from '../models/response-search';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HistorialUsuariosService } from '../../providers/historial-usuarios.service';

@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.component.html',
  styleUrls: ['./historial-usuario.component.scss']
})
export class HistorialUsuarioComponent implements OnInit {

  data: any; // informacion del back por el servicio de buscar historial x usuario
  displayedColumns = ['fecha', 'busqueda', 'tipoBusqueda', 'url']; // culmnas tabla
  dataSource; // data table

  numeroPage = 1; // numero de paginas para la paginacion
  totalPages = 1; // total de paginas obtenidas en el servicio
  color = '#000';
  colorR = '#eee';

  @ViewChild(MatSort) sort: MatSort; // sort para ordenar
  @ViewChild(MatPaginator) paginator: MatPaginator; // paginator
 
  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  constructor(
    private responseSearch: ResponseSearch,
    private historialUsuariosService: HistorialUsuariosService,
    breakpointObserver: BreakpointObserver
  ) {
    this.responseSearch.setActiveMostrarBarra(false);
    breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      this.displayedColumns = result.matches ?
        ['fecha', 'busqueda', 'tipoBusqueda', 'url'] :
        ['fecha', 'busqueda', 'tipoBusqueda', 'url'];
    });

   /*  this.data = this.responseSearch._historial.map(data => {
      data.busqueda = data.busqueda.toLowerCase();
      data.tipoBusqueda = data.tipoBusqueda.toLowerCase();
      data.url = data.url.toLowerCase();
      return data;
    }); */
    console.log(this.data);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ngOnInit() {
    this.buscarBusquedaHistorial('');
  }
  /**
    * @param  {} tipo tipo de boton que ejecuta la funcion
    * buscar el historial de busqueda que se devuelve con la paginacion
  */
  buscarBusquedaHistorial(tipo) {
    if (tipo === 'left') {
      this.numeroPage--;
    } else if (tipo === 'right') {
      this.numeroPage++;
    }
    this.historialUsuariosService.getHistorialUsuarios({numPagina : this.numeroPage, user_id : 1}).subscribe((data) => {
      this.data = data;
      if (this.data.length > 0) {
        this.totalPages = Math.ceil(this.data[0].numPaginas);
      }
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
    });
  }
  /**
     * Asignar valores al sort y paginacion
  */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  /**
     *Validar la paginacion boton izquierda
  */
  validarLeft() {
    if (this.numeroPage <= 1) {
      return true;
    } else {
      return false;
    }
  }
  /**
     *Validar la paginacion boton derecha
  */
  validarRight() {
    if(this.numeroPage >= this.totalPages) {
      return true;
    } else {
      return false;
    }
  }
  /**
    * @param  {} event petecion
    *Ordenar por fecha
  */
  sortData(event) {
    this.data = this.data.sort((a, b) => {
      const fecha1 = new Date(a.fecha_busqueda).valueOf();
      const fecha2 = new Date(a.fecha_busqueda).valueOf();
      return fecha1 > fecha2 ? 1 : -1;
    });
  }

}
