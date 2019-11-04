import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { ResponseSearch } from '../models/response-search';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HistorialUsuariosService } from '../providers/historial-usuarios.service';
import { matTableFilter } from '../../common/matTableFilter';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';

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
  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {

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
      this.dataSource = new MatTableDataSource(this.busquedas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    });

  }


}
