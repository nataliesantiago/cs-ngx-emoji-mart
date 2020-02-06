import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { User } from '../../schemas/user.schema';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
import { FiltrosService } from '../providers/filtros.service';

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
  tipos_encuesta;
  filters = {};

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, 
              private cg: ChangeDetectorRef, private qs: QuillService, private filtros_service: FiltrosService) {
    this.usuario = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.ajax.get('encuestas/obtener', {}).subscribe(p => {
      if (p.success) {
        this.encuestas = p.encuestas;
        this.createTable(this.encuestas);
      }
    })

    this.filtros_service.getSurveyType().then(result => {
      this.tipos_encuesta = result;
    });

  }

  init() {

  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
  }

  ngOnInit() {
  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-encuestas', e.idtbl_encuesta]);
  }

  activarEncuesta(e){

    swal.fire({
      title: 'Confirme para activar la encuesta',
      text: "Al momento de activarla, se desactivará la encuesta activa",
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
                this.createTable(this.encuestas);
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

  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.encuestas);
    } else {
      this.filters[name] = event.value;
      let newArray = this.encuestas;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}
