import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-ad-expertos',
  templateUrl: './ad-expertos.component.html',
  styleUrls: ['./ad-expertos.component.scss']
})
export class AdExpertosComponent implements OnInit {

  user: User;
  id_usuario;
  usuarios = [];
  displayedColumns = ['acciones', 'id', 'nombre', 'correo'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'idtbl_usuario', type:'number'},
    {field: 'nombre', type:'string'},
    {field: 'correo', type:'string'}
  ];

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService){
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.ajax.get('user/obtener-rol-usuario', { id_rol: 2}).subscribe(p => {
      if (p.success) {
        this.usuarios = p.usuarios;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
      }
    })
    

  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-ad-experto', e.idtbl_usuario]);
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
