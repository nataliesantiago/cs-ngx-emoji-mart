import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-ad-categoria-experticia',
  templateUrl: './ad-categoria-experticia.component.html',
  styleUrls: ['./ad-categoria-experticia.component.scss']
})
export class AdCategoriaExperticiaComponent implements OnInit {

  user: User;
  id_usuario;
  categorias = [];
  displayedColumns = ['acciones', 'idtbl_categoria_experticia', 'nombre'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'idtbl_categoria_experticia', type: 'number' },
    { field: 'nombre', type: 'string' }
  ];

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });

    this.ajax.get('experticia/obtener-categorias', {}).subscribe(p => {
      if (p.success) {
        this.categorias = p.categorias;
        this.dataSource = new MatTableDataSource(this.categorias);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
      }
    })
  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-categoria-expertiz', e.idtbl_categoria_experticia]);
  }

  borrarElemento(e) {

    swal.fire({
      title: 'Eliminar Categoría de Experticia',
      text: "Confirme para eliminar la categoría",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        this.ajax.post('experticia/eliminar-categoria', { categoria_experticia: e }).subscribe(p1 => {
          if (p1.success) {
            this.ajax.get('experticia/obtener-categorias', {}).subscribe(p => {
              if (p.success) {
                this.categorias = p.categorias;
                this.dataSource = new MatTableDataSource(this.categorias);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
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

  ngOnInit() {
  }

}
