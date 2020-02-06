import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { User } from '../../schemas/user.schema';
import { matTableFilter } from '../../common/matTableFilter';
import swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-productos',
  templateUrl: './creacion-productos.component.html',
  styleUrls: ['./creacion-productos.component.scss']
})
export class CreacionProductosComponent implements OnInit {

  usuario;
  id_usuario;
  productos = [];
  displayedColumns = ['acciones', 'idtbl_producto', 'nombre', 'arbol', 'nombre_icono'];
  arbol = [];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'idtbl_producto', type: 'number' },
    { field: 'nombre', type: 'string' }];
  user: User;
  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
      }
    });
    this.ajax.get('producto/obtener', {}).subscribe(p => {
      if (p.success) {

        this.productos = p.productos;

        /*for(let i = 0; i < this.productos.length; i++){
          this.productos[i].familia = this.productos[i].nombre;
          this.obtenerArbol(this.productos[i], i);
        }*/
        this.dataSource = new MatTableDataSource(this.productos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
        this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
          const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
            return (currentTerm + (data as { [key: string]: any })[key]);
          }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          return dataStr.indexOf(transformedFilter) != -1;
        }
      }
    })

  }

  obtenerArbol(e, pos) {
    let arbol = [];
    let producto_actual;
    if (e.id_producto_padre != null) {
      this.ajax.get('producto/obtener-padre', { idtbl_producto: e.id_producto_padre }).subscribe(p => {
        if (p.success) {
          producto_actual = p.producto[0];
          arbol.push(producto_actual);
          this.productos[pos].familia = producto_actual.nombre + ">" + this.productos[pos].familia;
          this.obtenerArbol(producto_actual, pos);
        }
      })
    } else {

    }
  }

  ngOnInit() {
  }

  editarRegistro(e) {
    this.router.navigate(['/formulario-productos'], { queryParams: { id_producto: e.idtbl_producto } });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  eliminarProducto(e) {
    swal.fire({
      title: 'Eliminar Categoría',
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
        this.ajax.post('producto/eliminar', { idtbl_producto: e.idtbl_producto, id_usuario: this.user.idtbl_usuario }).subscribe(p => {
          if (p.success) {
            this.ajax.get('producto/obtener', {}).subscribe(p => {
              if (p.success) {

                this.productos = p.productos;
                this.dataSource = new MatTableDataSource(this.productos);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
                this.cg.detectChanges();
              }
            })
          }
        })
      }
    })

  }

}
