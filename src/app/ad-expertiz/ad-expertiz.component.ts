import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-ad-expertiz',
  templateUrl: './ad-expertiz.component.html',
  styleUrls: ['./ad-expertiz.component.scss']
})
export class AdExpertizComponent implements OnInit {

  user: User;
  id_usuario;
  experticias = [];
  displayedColumns = ['acciones', 'idtbl_experticia', 'nombre'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'idtbl_experticia', type:'number'},
    {field: 'nombre', type:'string'}
  ];
  
  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService){
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.ajax.get('experticia/obtener', {}).subscribe(p => {
      if (p.success) {
        this.experticias = p.experticias;
        this.dataSource = new MatTableDataSource(this.experticias);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
      }
    })
  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-expertiz', e.idtbl_experticia]);
  }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
