import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { User } from '../../schemas/user.schema';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-ad-encuestas',
  templateUrl: './ad-encuestas.component.html',
  styleUrls: ['./ad-encuestas.component.scss']
})
export class AdEncuestasComponent implements OnInit {

  usuario;
  id_usuario;
  encuestas = [];
  displayedColumns = ['acciones', 'idtbl_encuesta', 'nombre', 'id_tipo_encuesta', 'activo'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'idtbl_encuesta', type:'number'},
    {field: 'nombre', type:'string'},
    {field: 'id_tipo_encuesta', type:'boolean', values:{"1":"Cliente","2":"Experto"}},
    {field: 'activo', type:'boolean', values:{"1":"Activo","0":"Inactivo"}}
  ];
  user: User;
  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.usuario = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.ajax.get('encuestas/obtener', {}).subscribe(p => {
      if (p.success) {
        this.encuestas = p.encuestas;
        this.dataSource = new MatTableDataSource(this.encuestas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
      }
    })

  }

  init() {

  }

  ngOnInit() {
  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-encuestas', e.idtbl_encuesta]);
  }

  activarEncuesta(e){

    swal.fire({
      title: 'Confirme para activar la encuesta',
      text: "Al momento de activarala, se desactivará la encuesta activa",
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
        this.ajax.get('encuestas/activar', { encuesta: e}).subscribe(p1 => {
          if(p1.success){
            this.ajax.get('encuestas/obtener', {}).subscribe(p => {
              if (p.success) {
                this.encuestas = p.encuestas;
                this.dataSource = new MatTableDataSource(this.encuestas);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
              }
            })
          }
        })
      }
    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
